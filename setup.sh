#!/bin/bash

# Script de configuration automatique RobotPi IDE
# Usage: ./setup.sh

echo "🤖 Configuration de RobotPi IDE..."
echo ""

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    echo "📥 Installez Node.js depuis https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) détecté"

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

echo "✅ npm $(npm --version) détecté"

# Vérifier Python
if ! command -v python3 &> /dev/null; then
    echo "⚠️  Python3 n'est pas installé (nécessaire pour ampy)"
    echo "📥 Installez Python depuis https://www.python.org/"
fi

# Vérifier ampy
if ! command -v ampy &> /dev/null; then
    echo "⚠️  ampy n'est pas installé"
    echo "📦 Installation d'ampy..."
    pip3 install adafruit-ampy
    
    if [ $? -eq 0 ]; then
        echo "✅ ampy installé"
    else
        echo "❌ Erreur lors de l'installation d'ampy"
        echo "Essayez manuellement: pip3 install adafruit-ampy"
    fi
else
    echo "✅ ampy détecté"
fi

echo ""
echo "📦 Installation des dépendances npm..."

# Installer les dépendances
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances"
    exit 1
fi

echo ""
echo "✅ Installation terminée !"
echo ""
echo "🚀 Pour démarrer l'application:"
echo "   npm start"
echo ""
echo "📦 Pour créer un exécutable:"
echo "   npm run build        # Toutes les plateformes"
echo "   npm run build:mac    # macOS uniquement"
echo "   npm run build:win    # Windows uniquement"
echo "   npm run build:linux  # Linux uniquement"
echo ""echo "🤖 Amusez-vous bien avec RobotPi IDE !"
