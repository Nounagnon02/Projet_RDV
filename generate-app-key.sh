#!/usr/bin/env bash

echo "🔑 Génération de la clé APP_KEY pour Laravel..."
echo ""
echo "Copiez cette valeur dans les variables d'environnement Render:"
echo ""

cd backend
php artisan key:generate --show

echo ""
echo "✅ Clé générée avec succès!"
echo ""
echo "📋 Étapes suivantes:"
echo "1. Copiez la clé ci-dessus"
echo "2. Allez sur Render Dashboard → Votre service → Environment"
echo "3. Ajoutez/Modifiez la variable APP_KEY avec cette valeur"
echo "4. Sauvegardez et redéployez"
