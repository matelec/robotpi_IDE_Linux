# 🤖 RobotPi IDE

> Interface de programmation visuelle pour Raspberry Pi Pico avec téléversement via ampy

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Electron](https://img.shields.io/badge/Electron-28.3.3-blue.svg)](https://www.electronjs.org/)
[![MicroPython](https://img.shields.io/badge/MicroPython-1.20+-green.svg)](https://micropython.org/)
[![Platform](https://img.shields.io/badge/Platform-Linux%20%7C%20Windows%20%7C%20macOS-lightgrey.svg)](https://github.com/matelec/RobotPi-IDE)

Application desktop multiplateforme pour programmer facilement un robot mobile basé sur Raspberry Pi Pico, driver TB6612FNG et capteur de distance VL53L0X.

![RobotPi Desktop Screenshot](docs/screenshot.png)

## ✨ Fonctionnalités

- 🎨 **Interface par blocs Blockly** - Programmation visuelle intuitive
- 🐍 **Génération de code Python** automatique et optimisée
- 📤 **Téléversement direct** sur le Pico via ampy
- 📂 **Gestionnaire de fichiers** pour explorer le système de fichiers du Pico
- 💾 **Sauvegarde/chargement** de projets au format JSON
- 📡 **Moniteur série** en temps réel pour le débogage
- 🔄 **Détection automatique** des ports série Raspberry Pi Pico
- ⚙️ **Configuration des pins GPIO** personnalisable
- 🖥️ **Multiplateforme** : Linux, Windows, macOS

## 🎯 Blocs Disponibles

### Mouvements
- Initialiser le robot
- Avancer / Reculer (instantané ou temporisé)
- Tourner à gauche / droite (instantané ou temporisé)
- Stopper les moteurs

### Capteurs
- Détecter un obstacle devant
- Lire la distance en cm
- Éviter un obstacle automatiquement

### Lumières (LEDs WS2812B)
- Allumer/éteindre toutes les LEDs
- Allumer/éteindre une LED spécifique
- Changer la couleur (7 couleurs disponibles)
- Faire clignoter les LEDs
- Régler la luminosité (0-100%)

### Bouton
- Démarrer au bouton
- Arrêter au bouton
- Vérifier si le bouton est appuyé
- Arrêter si bouton appuyé (dans une boucle)

### Temporisation
- Attendre X secondes

### Standard Blockly
- Logique (conditions, opérateurs booléens)
- Boucles (répéter, tant que, pour chaque)
- Mathématiques (opérations, fonctions)
- Texte (manipulation de chaînes)
- Listes (tableaux)
- Variables et Fonctions

## 📋 Prérequis

### Logiciels Nécessaires

1. **Node.js** v16+ ([Télécharger](https://nodejs.org/))
2. **Python 3.7+** ([Télécharger](https://www.python.org/))
3. **ampy** (Adafruit MicroPython Tool)
   ```bash
   pip3 install --user adafruit-ampy
   ```

### Matériel Nécessaire

- **Raspberry Pi Pico** avec MicroPython installé
- **Driver moteur TB6612FNG** (double pont en H)
- **2 moteurs DC** (avec encodeurs optionnels)
- **Capteur de distance VL53L0X** (I2C)
- **Bandeau de LEDs WS2812B** (NeoPixels)
- **Bouton poussoir** pour contrôle manuel
- **Châssis de robot** mobile
- **Batterie** (4x AA ou LiPo 7.4V)
- **Câbles de connexion** Dupont

## 🚀 Installation et Utilisation

### Méthode 1 : Utiliser les Exécutables Pré-compilés (Recommandé)

Téléchargez la dernière version depuis [GitHub Releases](https://github.com/matelec/RobotPi-IDE/releases) :

#### Linux
```bash
# AppImage (portable, fonctionne sur toutes les distributions)
chmod +x RobotPi-IDE-*.AppImage
./RobotPi-IDE-*.AppImage

# Debian/Ubuntu (.deb)
sudo dpkg -i robotpi-ide_*_amd64.deb
robotpi-ide

# Fedora/Red Hat (.rpm)
sudo rpm -i robotpi-ide-*.x86_64.rpm
robotpi-ide
```

#### Windows
```
Double-cliquer sur RobotPi-IDE-Setup.exe
```

#### macOS
```
Ouvrir RobotPi-IDE.dmg et glisser l'application dans Applications
```

### Méthode 2 : Installation depuis les Sources

```bash
# 1. Cloner le dépôt
git clone https://github.com/matelec/RobotPi-IDE.git
cd RobotPi-IDE

# 2. Installer les dépendances
npm install

# 3. Lancer l'application en mode développement
npm start
```

## 🔨 Compilation (Build)

### Prérequis pour le Build

#### Linux
```bash
# Ubuntu/Debian
sudo apt-get install -y build-essential libudev-dev

# Fedora
sudo dnf install -y @development-tools systemd-devel
```

#### Windows
- Visual Studio Build Tools ou Visual Studio Community

#### macOS
- Xcode Command Line Tools

### Commandes de Build

```bash
# Linux
npm run build:appimage    # AppImage portable
npm run build:deb         # Package Debian/Ubuntu
npm run build:rpm         # Package Fedora/Red Hat
npm run build:all         # Tous les formats Linux

# Windows (depuis Windows)
npm run build:win         # Installeur NSIS

# macOS (depuis macOS)
npm run build:mac         # Image disque DMG

# Script automatique (Linux uniquement)
chmod +x build.sh
./build.sh appimage       # ou deb, rpm, all
```

Les fichiers compilés se trouvent dans le dossier `dist/`.

### Tailles Attendues
- **AppImage** : ~150-200 MB
- **DEB/RPM** : ~120-150 MB
- **Windows EXE** : ~130-180 MB
- **macOS DMG** : ~150-200 MB

## 🛠️ Développement

### Structure du Projet

```
RobotPi-IDE/
├── package.json              # Configuration npm et electron-builder
├── build.sh                  # Script de build automatique (Linux)
├── .gitignore               # Fichiers à ignorer
│
├── electron/                # Processus principal Electron
│   ├── main.js             # Point d'entrée, gestion IPC, ampy
│   └── preload.js          # Pont IPC sécurisé
│
├── app/                     # Application frontend (renderer)
│   ├── index.html          # Interface utilisateur principale
│   │
│   ├── css/
│   │   └── style.css       # Styles (thème sombre VSCode)
│   │
│   └── js/
│       ├── editor/
│       │   └── RobotPiEditor.js    # Éditeur principal, gestion UI
│       │
│       ├── blockly/
│       │   ├── blocks/             # Blocs Blockly personnalisés
│       │   │   ├── mouvements.js
│       │   │   ├── capteurs.js
│       │   │   ├── lumieres.js
│       │   │   ├── bouton.js
│       │   │   └── attendre.js
│       │   │
│       │   ├── generators/         # Générateurs de code Python
│       │   │   ├── python_mouvements.js
│       │   │   ├── python_capteurs.js
│       │   │   ├── python_lumieres.js
│       │   │   ├── python_bouton.js
│       │   │   └── python_attendre.js
│       │   │
│       │   ├── toolbox.js          # Définition de la boîte à outils
│       │   └── startBlocks.js      # Blocs de démarrage
│       │
│       ├── ampy-manager.js         # Gestion des opérations ampy
│       └── config.js               # Configuration par défaut
│
├── assets/                  # Ressources statiques
│   └── icon.png            # Icône de l'application (512x512)
│
└── micropython/            # Bibliothèque MicroPython
│   └── robotPi.py         # Classe RobotPi pour le Pico
├── Electronique/          # Fichiers de fabrications de la carte électronique
├── Construction/          # Fichiers de conception mécanique du robot

```

### Workflow de Développement

```bash
# 1. Créer une branche pour votre fonctionnalité
git checkout -b ma-feature

# 2. Faire vos modifications
# ...

# 3. Tester en mode développement
npm run dev    # Lance avec DevTools ouvert

# 4. Tester le build
npm run build:appimage

# 5. Commiter et pousser
git add .
git commit -m "Ajout de ma fonctionnalité"
git push origin ma-feature

# 6. Créer une Pull Request sur GitHub
```

### Scripts Disponibles

| Commande | Description |
|----------|-------------|
| `npm start` | Lance l'application en mode normal |
| `npm run dev` | Lance avec DevTools (mode développement) |
| `npm run build` | Build pour Linux (AppImage + DEB) |
| `npm run build:appimage` | Build AppImage uniquement |
| `npm run build:deb` | Build package Debian uniquement |
| `npm run build:win` | Build pour Windows |
| `npm run build:mac` | Build pour macOS |
| `npm run build:all` | Build tous les formats Linux |

## 📖 Guide d'Utilisation

### 1. Première Utilisation

1. **Connecter le Raspberry Pi Pico** via USB
2. **Lancer RobotPi IDE**
3. **Sélectionner le port série** dans la barre d'outils
4. **Installer la bibliothèque** robotPi.py (bouton "Installer Lib")
5. **Créer votre programme** avec les blocs Blockly
6. **Générer le code Python** (bouton "Générer Python")
7. **Téléverser sur le Pico** (bouton "Téléverser")

### 2. Configuration du Robot

Modifier `app/js/config.js` pour adapter les pins GPIO :

```javascript
const CONFIG = {
    pins: {
        pwmG: 0,      // PWM moteur gauche
        in1G: 1,      // IN1 moteur gauche
        in2G: 2,      // IN2 moteur gauche
        pwmD: 3,      // PWM moteur droit
        in1D: 4,      // IN1 moteur droit
        in2D: 5,      // IN2 moteur droit
        stby: 6       // Standby TB6612FNG
    }
};
```

### 3. Moniteur Série

- Cliquer sur **"📡 Moniteur série"** pour voir les messages du Pico en temps réel
- Utiliser **"🔄 Reset Pico"** pour redémarrer le programme
- Les messages `print()` du code Python s'affichent dans la console

### 4. Gestionnaire de Fichiers

- Bouton **"📂 Fichiers"** pour explorer les fichiers sur le Pico
- Télécharger des fichiers depuis le Pico vers votre ordinateur
- Supprimer des fichiers du Pico

## 🐛 Dépannage

### ampy non trouvé
```bash
# Installer ampy
pip3 install --user adafruit-ampy

# Ajouter au PATH
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Vérifier
ampy --version
```

### Permission refusée sur le port série (Linux)
```bash
# Ajouter votre utilisateur au groupe dialout
sudo usermod -a -G dialout $USER

# Redémarrer votre session ou redémarrer le PC
```

### Le Pico n'est pas détecté
1. Vérifier que MicroPython est bien installé sur le Pico
2. Débrancher/rebrancher le Pico
3. Cliquer sur le bouton 🔄 "Actualiser les ports"
4. Sur Windows, installer les drivers USB si nécessaire

### Erreur de téléversement
1. Fermer le moniteur série avant de téléverser
2. Vérifier qu'aucun autre programme n'utilise le port série
3. Redémarrer l'application

### AppImage ne se lance pas (Linux)
```bash
# Installer FUSE
sudo apt-get install fuse libfuse2

# Donner les permissions d'exécution
chmod +x RobotPi-IDE-*.AppImage
```

## 🤝 Contribution

Les contributions sont les bienvenues ! 

1. **Fork** le projet
2. Créer une **branche** pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. **Commiter** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Pousser** vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une **Pull Request**

### Guidelines

- Suivre le style de code existant
- Commenter les nouvelles fonctionnalités
- Tester avant de soumettre
- Mettre à jour la documentation si nécessaire

## 📝 Changelog

### Version 1.0.0 (2025-01-31)
- 🎉 Version initiale
- ✨ Interface Blockly complète
- 📤 Téléversement via ampy
- 📡 Moniteur série temps réel
- 📂 Gestionnaire de fichiers
- 🎨 Support LEDs WS2812B
- 🤖 Support TB6612FNG
- 📏 Support VL53L0X

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

**RATTE MATTHIAS**

- GitHub: [@matelec](https://github.com/matelec)
- Projet: [RobotPi-IDE](https://github.com/matelec/RobotPi-IDE)

## 🙏 Remerciements

- [Electron](https://www.electronjs.org/) - Framework desktop
- [Blockly](https://developers.google.com/blockly) - Éditeur visuel
- [Adafruit ampy](https://github.com/scientifichackers/ampy) - Outil de gestion MicroPython
- [MicroPython](https://micropython.org/) - Python pour microcontrôleurs
- [Raspberry Pi Pico](https://www.raspberrypi.com/products/raspberry-pi-pico/) - Microcontrôleur RP2040

## 📚 Ressources

- [Documentation MicroPython Pico](https://docs.micropython.org/en/latest/rp2/quickref.html)
- [Datasheet TB6612FNG](https://www.sparkfun.com/datasheets/Robotics/TB6612FNG.pdf)
- [Documentation VL53L0X](https://www.st.com/en/imaging-and-photonics-solutions/vl53l0x.html)
- [Guide WS2812B](https://cdn-shop.adafruit.com/datasheets/WS2812B.pdf)
- [Blockly Developer Tools](https://developers.google.com/blockly/guides/overview)

---

<div align="center">

**⭐ Si ce projet vous aide, n'hésitez pas à lui donner une étoile ! ⭐**

[Signaler un bug](https://github.com/matelec/RobotPi-IDE/issues) · [Demander une fonctionnalité](https://github.com/matelec/RobotPi-IDE/issues) · [Documentation](https://github.com/matelec/RobotPi-IDE/wiki)

</div>
