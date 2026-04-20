#!/bin/bash

echo "🔍 DIAGNOSTIC DU PROBLÈME"
echo "=========================="
echo ""

echo "📋 Étape 1: Vérifier les fichiers .env locaux"
echo "----------------------------------------------"
cd frontend
if [ -f .env ]; then
    echo "❌ Fichier .env trouvé (ne devrait pas exister):"
    cat .env
    echo ""
else
    echo "✅ Pas de fichier .env"
fi

if [ -f .env.local ]; then
    echo "❌ Fichier .env.local trouvé:"
    cat .env.local
    echo ""
else
    echo "✅ Pas de fichier .env.local"
fi

if [ -f .env.production ]; then
    echo "⚠️  Fichier .env.production trouvé:"
    cat .env.production
    echo ""
fi

echo ""
echo "📋 Étape 2: Vérifier le code axios.js"
echo "--------------------------------------"
grep -A 2 "baseURL" src/api/axios.js
echo ""

echo ""
echo "📋 Étape 3: Vérifier si des .env sont trackés par git"
echo "------------------------------------------------------"
git ls-files | grep "\.env"
if [ $? -eq 0 ]; then
    echo "❌ Des fichiers .env sont trackés par git (PROBLÈME!)"
else
    echo "✅ Aucun fichier .env tracké par git"
fi

echo ""
echo "=========================="
echo "🎯 ACTIONS À FAIRE:"
echo "=========================="
echo ""
echo "1. Si vous voyez des fichiers .env ci-dessus avec l'ancienne URL:"
echo "   → Supprimez-les et commitez"
echo ""
echo "2. Avez-vous déployé le backend sur Render ?"
echo "   → Si NON: Déployez d'abord le backend"
echo "   → Si OUI: Quelle est l'URL ? (ex: https://xxx.onrender.com)"
echo ""
echo "3. Sur Vercel, avez-vous:"
echo "   → Supprimé complètement VITE_API_URL"
echo "   → Recréé avec la vraie URL + /api"
echo "   → Redéployé SANS cache"
echo ""
