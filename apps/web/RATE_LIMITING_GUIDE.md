# 🛡️ Guide Rate Limiting

## Vue d'ensemble

Le système de rate limiting protège l'API contre les abus en limitant le nombre de requêtes par client.

**Version actuelle**: In-memory (Map) - Suffisant pour MVP
**Roadmap V2**: Migration vers Upstash Redis pour scaling multi-instances

---

## Configuration par défaut

| Type de route | Limite | Fenêtre | Identifiant |
|---------------|--------|---------|-------------|
| **Publique** | 60 req/min | 60s | IP |
| **Authentifiée** | 120 req/min | 60s | User ID |
| **Strict** (paiements, emails) | 10 req/min | 60s | IP ou User |

---

## Utilisation

### ✅ Route protégée (exemple implémenté)

```typescript
// apps/web/src/app/api/stripe/create-checkout-session/route.ts
import { rateLimitStrict, getClientIP } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  // 🛡️ Rate limiting
  const ip = getClientIP(req);
  const rateLimitResult = await rateLimitStrict(`checkout:${ip}`);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Trop de requêtes' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
        }
      }
    );
  }

  // ... logique de la route
}
```

### Routes à protéger (TODO)

**Haute priorité**:
- ✅ `/api/stripe/create-checkout-session` - FAIT
- ⬜ `/api/stripe/webhook` - Protection webhooks
- ⬜ `/api/courses/[id]/enroll` - Inscriptions
- ⬜ `/api/creator/analytics` - Analytics (peut être call souvent)
- ⬜ `/api/profile/upload-avatar` - Upload fichiers
- ⬜ `/api/stripe/refund` - Remboursements

**Moyenne priorité**:
- ⬜ `/api/courses/[id]/reviews` - POST reviews
- ⬜ `/api/lessons/[id]/comments` - POST commentaires
- ⬜ `/api/profile/update` - Update profil

**Routes publiques** (limites plus permissives):
- ⬜ `GET /api/courses` - Liste cours
- ⬜ `GET /api/courses/[id]` - Détail cours

---

## Fonctions disponibles

### `rateLimitByIP(ip: string, config?)`
Pour routes publiques - 60 req/min par IP

### `rateLimitByUser(userId: string, config?)`
Pour routes authentifiées - 120 req/min par user

### `rateLimitStrict(identifier: string, config?)`
Pour actions sensibles - 10 req/min

### `getClientIP(request: Request)`
Extrait l'IP du client (supporte Cloudflare, proxies)

---

## Migration Upstash Redis (V2)

**Quand migrer ?**
- Déploiement multi-instances (Vercel, scaling horizontal)
- Besoin de persistance entre redémarrages
- Analytics rate limit centralisés

**Steps**:
1. Créer compte Upstash (gratuit jusqu'à 10k req/jour)
2. Ajouter variables `.env`:
   ```
   UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
   UPSTASH_REDIS_REST_TOKEN=xxx
   ```
3. Remplacer le Map() dans `lib/rate-limit.ts` par:
   ```typescript
   import { Ratelimit } from "@upstash/ratelimit";
   import { Redis } from "@upstash/redis";

   const redis = new Redis({
     url: process.env.UPSTASH_REDIS_REST_URL!,
     token: process.env.UPSTASH_REDIS_REST_TOKEN!,
   });

   export const rateLimit = new Ratelimit({
     redis,
     limiter: Ratelimit.slidingWindow(60, "1 m"),
   });
   ```

---

## Testing

```bash
# Test rate limit
for i in {1..15}; do
  curl -X POST http://localhost:3000/api/stripe/create-checkout-session \
    -H "Content-Type: application/json" \
    -d '{"courseId":"xxx","userId":"xxx"}'
  echo "Request $i"
done
```

Après 10 requêtes, vous devriez recevoir un `429 Too Many Requests`.

---

## Monitoring

Les logs contiennent:
```
⚠️ [RATE LIMIT] Limite atteinte pour "checkout:192.168.1.1" - 11/10
```

**Métriques à tracker** (Sentry, Datadog):
- Nombre de 429 par route
- IPs les plus bloquées
- Patterns d'abus

---

## FAQ

**Q: Pourquoi in-memory et pas Redis dès le début ?**
R: Pour le MVP single-instance, c'est plus simple et sans dépendance externe. Migration facile plus tard.

**Q: Les limites sont-elles partagées entre routes ?**
R: Non, chaque route a son propre compteur (préfixe différent).

**Q: Comment whitelister une IP ?**
R: Ajouter une condition dans `rate-limit.ts`:
```typescript
const WHITELISTED_IPS = ['127.0.0.1', '::1'];
if (WHITELISTED_IPS.includes(ip)) {
  return { success: true, ... };
}
```
