#!/bin/bash

# Charger les variables d'environnement
source apps/web/.env.local

# Exécuter la migration SQL via psql ou l'API Supabase
echo "📝 [MIGRATION] Application de la migration reviews..."
echo ""
echo "🔗 Ouvrez Supabase SQL Editor:"
echo "   https://supabase.com/dashboard/project/dwwkjhorxfjxhzozacxe/sql"
echo ""
echo "📋 Copiez et collez le SQL suivant:"
echo ""
cat apps/web/supabase/migrations/20241116_add_reviews.sql
