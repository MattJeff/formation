# Guide de Déploiement - Brainow

Ce guide détaille le processus de déploiement de la plateforme Brainow en production.

---

## Architecture de Déploiement

```
┌─────────────────────────────────────────────────────────────┐
│                         INTERNET                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      CLOUDFLARE CDN                          │
│                    (DNS + DDoS Protection)                   │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
┌───────────────────────┐       ┌───────────────────────┐
│   VERCEL (Frontend)   │       │   AWS/GCP (Backend)   │
│   - Next.js App       │       │   - NestJS API        │
│   - Edge Functions    │       │   - Kubernetes        │
│   - Static Assets     │       │   - Load Balancer     │
└───────────────────────┘       └───────────────────────┘
                                            │
                ┌───────────────────────────┼───────────────────────────┐
                ▼                           ▼                           ▼
┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐
│  SUPABASE (Database)  │   │  AWS EKS (Sandbox)    │   │  EXTERNAL SERVICES    │
│  - PostgreSQL         │   │  - Workspace Pods     │   │  - Stripe             │
│  - Auth               │   │  - Verification       │   │  - Mux                │
│  - Storage            │   │  - Auto-scaling       │   │  - Anthropic          │
└───────────────────────┘   └───────────────────────┘   └───────────────────────┘
```

---

## Environnements

| Environnement | URL | Branche Git | Auto-deploy |
|---------------|-----|-------------|-------------|
| **Development** | localhost:3000 | - | Non |
| **Staging** | staging.brainow.com | `develop` | Oui |
| **Production** | brainow.com | `main` | Manuel |

---

## 1. Déploiement Frontend (Vercel)

### Configuration Initiale

1. **Créer un compte Vercel**
   - Aller sur [vercel.com](https://vercel.com)
   - Se connecter avec GitHub

2. **Importer le projet**
   ```bash
   # Via CLI
   npm i -g vercel
   vercel login
   vercel --prod
   ```

3. **Configuration du projet**
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `cd ../.. && npm run build --filter=@brainow/web`
   - **Output Directory**: `.next`

### Variables d'Environnement

Dans le dashboard Vercel (Settings → Environment Variables):

```bash
# Application
NEXT_PUBLIC_APP_URL=https://brainow.com
NEXT_PUBLIC_API_URL=https://api.brainow.com
NEXT_PUBLIC_SANDBOX_URL=https://sandbox.brainow.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe (clé publique uniquement)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### Domaine Personnalisé

1. Dans Vercel: Settings → Domains
2. Ajouter `brainow.com` et `www.brainow.com`
3. Configurer les DNS chez votre registrar:
   ```
   A     @     76.76.21.21
   CNAME www   cname.vercel-dns.com
   ```

### Déploiement

```bash
# Déploiement automatique sur push
git push origin main

# Ou manuel via CLI
vercel --prod
```

---

## 2. Déploiement Backend (AWS EKS)

### Prérequis

- Compte AWS configuré
- `kubectl` installé
- `aws-cli` installé et configuré
- `eksctl` installé

### Créer le Cluster EKS

```bash
# Créer le cluster (prend ~15 minutes)
eksctl create cluster \
  --name brainow-prod \
  --region eu-west-1 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 3 \
  --nodes-min 2 \
  --nodes-max 10 \
  --managed

# Configurer kubectl
aws eks update-kubeconfig --region eu-west-1 --name brainow-prod

# Vérifier
kubectl get nodes
```

### Déployer l'API Backend

1. **Build et Push l'image Docker**

```bash
# Build
cd apps/api
docker build -t brainow/api:latest .

# Tag pour ECR
docker tag brainow/api:latest 123456789.dkr.ecr.eu-west-1.amazonaws.com/brainow/api:latest

# Login ECR
aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.eu-west-1.amazonaws.com

# Push
docker push 123456789.dkr.ecr.eu-west-1.amazonaws.com/brainow/api:latest
```

2. **Déployer sur Kubernetes**

```yaml
# k8s/api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: brainow-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: brainow-api
  template:
    metadata:
      labels:
        app: brainow-api
    spec:
      containers:
      - name: api
        image: 123456789.dkr.ecr.eu-west-1.amazonaws.com/brainow/api:latest
        ports:
        - containerPort: 4000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: brainow-secrets
              key: database-url
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: brainow-api
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 4000
  selector:
    app: brainow-api
```

```bash
# Créer les secrets
kubectl create secret generic brainow-secrets \
  --from-literal=database-url="postgresql://..." \
  --from-literal=jwt-secret="..." \
  --from-literal=stripe-secret="..."

# Déployer
kubectl apply -f k8s/api-deployment.yaml

# Vérifier
kubectl get pods
kubectl get svc
```

### Configurer l'Ingress (HTTPS)

```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: brainow-ingress
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts:
    - api.brainow.com
    secretName: brainow-tls
  rules:
  - host: api.brainow.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: brainow-api
            port:
              number: 80
```

```bash
# Installer cert-manager pour HTTPS
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Appliquer l'ingress
kubectl apply -f k8s/ingress.yaml
```

---

## 3. Déploiement du Sandbox

### Configuration Kubernetes

```yaml
# k8s/sandbox-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sandbox-manager
spec:
  replicas: 2
  selector:
    matchLabels:
      app: sandbox-manager
  template:
    metadata:
      labels:
        app: sandbox-manager
    spec:
      serviceAccountName: sandbox-manager
      containers:
      - name: manager
        image: brainow/sandbox-manager:latest
        env:
        - name: KUBERNETES_NAMESPACE
          value: "brainow-workspaces"
---
apiVersion: v1
kind: Namespace
metadata:
  name: brainow-workspaces
---
apiVersion: v1
kind: ResourceQuota
metadata:
  name: workspace-quota
  namespace: brainow-workspaces
spec:
  hard:
    requests.cpu: "50"
    requests.memory: 100Gi
    persistentvolumeclaims: "100"
```

### Auto-scaling

```yaml
# k8s/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: sandbox-manager-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: sandbox-manager
  minReplicas: 2
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

---

## 4. Base de Données (Supabase)

### Migration vers Production

```bash
# 1. Créer un projet Supabase Production
# 2. Copier la DATABASE_URL

# 3. Exécuter les migrations
cd packages/database
DATABASE_URL="postgresql://..." npx prisma migrate deploy

# 4. (Optionnel) Seed initial
DATABASE_URL="postgresql://..." npm run db:seed
```

### Backup Automatique

Supabase Pro inclut des backups automatiques quotidiens. Pour des backups personnalisés:

```bash
# Script de backup (cron daily)
#!/bin/bash
DATE=$(date +%Y%m%d)
pg_dump $DATABASE_URL | gzip > backup-$DATE.sql.gz
aws s3 cp backup-$DATE.sql.gz s3://brainow-backups/
```

---

## 5. CI/CD avec GitHub Actions

```yaml
# .github/workflows/deploy-production.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-west-1
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
      
      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/brainow/api:$IMAGE_TAG apps/api
          docker push $ECR_REGISTRY/brainow/api:$IMAGE_TAG
      
      - name: Deploy to EKS
        run: |
          aws eks update-kubeconfig --region eu-west-1 --name brainow-prod
          kubectl set image deployment/brainow-api api=$ECR_REGISTRY/brainow/api:$IMAGE_TAG
          kubectl rollout status deployment/brainow-api
```

---

## 6. Monitoring & Alertes

### Sentry (Erreurs)

```typescript
// apps/web/src/app/layout.tsx
import * as Sentry from '@sentry/nextjs';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: 'production',
    tracesSampleRate: 0.1,
  });
}
```

### Uptime Monitoring

Configurer [UptimeRobot](https://uptimerobot.com) ou [Pingdom](https://pingdom.com):
- `https://brainow.com` (check toutes les 5 min)
- `https://api.brainow.com/health` (check toutes les 5 min)

### Alertes Slack

```yaml
# k8s/alertmanager-config.yaml
receivers:
- name: 'slack'
  slack_configs:
  - api_url: 'https://hooks.slack.com/services/YOUR/WEBHOOK/URL'
    channel: '#alerts-prod'
    title: 'Brainow Alert'
    text: '{{ range .Alerts }}{{ .Annotations.description }}{{ end }}'
```

---

## 7. Rollback

### Frontend (Vercel)

```bash
# Via dashboard: Deployments → Sélectionner déploiement précédent → Promote to Production

# Ou via CLI
vercel rollback
```

### Backend (Kubernetes)

```bash
# Voir l'historique
kubectl rollout history deployment/brainow-api

# Rollback à la version précédente
kubectl rollout undo deployment/brainow-api

# Ou à une version spécifique
kubectl rollout undo deployment/brainow-api --to-revision=3
```

---

## Checklist de Déploiement

### Avant le Déploiement

- [ ] Tous les tests passent
- [ ] Code review approuvée
- [ ] Variables d'environnement configurées
- [ ] Migrations de DB testées
- [ ] Backup de la DB effectué
- [ ] Monitoring configuré

### Pendant le Déploiement

- [ ] Mode maintenance activé (si nécessaire)
- [ ] Migrations de DB exécutées
- [ ] Services déployés
- [ ] Health checks passent
- [ ] Tests de fumée (smoke tests)

### Après le Déploiement

- [ ] Vérifier les logs (pas d'erreurs)
- [ ] Tester les fonctionnalités critiques
- [ ] Vérifier les métriques (latence, erreurs)
- [ ] Annoncer le déploiement (Slack, changelog)
- [ ] Surveiller pendant 1h

---

## Coûts Estimés (Production)

| Service | Configuration | Coût Mensuel |
|---------|--------------|--------------|
| Vercel Pro | Illimité | $20 |
| AWS EKS | Cluster + 3 t3.medium | ~$150 |
| Supabase Pro | 8GB DB | $25 |
| Mux | 100h vidéo + streaming | ~$150 |
| Anthropic | ~30K interactions | ~$135 |
| Resend | 50K emails | $20 |
| Sentry | 50K errors | $26 |
| **TOTAL** | | **~$526/mois** |

---

**Dernière mise à jour**: 2024
