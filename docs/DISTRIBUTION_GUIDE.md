# 🚀 Guide de Distribution - RobotPi IDE pour Debian 12

## 📦 Contenu du Package

Vous avez créé un package d'installation complet pour Debian 12. Voici ce qui est inclus :

```
robotpi-ide-installer/
├── RobotPi-IDE-1.0.0.AppImage    # Application principale
├── install.sh                     # Script d'installation
├── uninstall.sh                   # Script de désinstallation
├── check-install.sh               # Script de vérification
├── quick-install.sh               # Installation rapide
├── README.md                      # Documentation utilisateur
├── CHANGELOG.md                   # Notes de version
└── VERSION                        # Numéro de version
```

## 🎯 Utilisation des Scripts

### 1. Script d'Installation (`install.sh`)

**Utilisation:**
```bash
sudo ./install.sh
```

**Ce qu'il fait:**
- ✅ Vérifie que le système est compatible (Debian/Ubuntu)
- ✅ Installe les dépendances (fuse, python3, pip3, etc.)
- ✅ Installe ampy (outil MicroPython)
- ✅ Configure les permissions USB pour le Raspberry Pi Pico
- ✅ Ajoute l'utilisateur aux groupes `dialout` et `plugdev`
- ✅ Copie l'AppImage dans `/opt/robotpi-ide/`
- ✅ Crée un lien symbolique dans `/usr/local/bin/`
- ✅ Crée un lanceur dans le menu applications
- ✅ Installe les icônes

**Personnalisation:**
Le script détecte automatiquement l'utilisateur via `$SUDO_USER`. Si besoin, vous pouvez le modifier pour spécifier un utilisateur différent.

### 2. Script de Désinstallation (`uninstall.sh`)

**Utilisation:**
```bash
sudo ./uninstall.sh
```

**Ce qu'il fait:**
- 🗑️ Supprime l'AppImage et le répertoire d'installation
- 🗑️ Supprime le lien symbolique
- 🗑️ Supprime le lanceur du menu
- 🗑️ Supprime les icônes
- ❓ Demande si vous voulez supprimer les règles USB
- ❓ Demande si vous voulez désinstaller ampy

### 3. Script de Vérification (`check-install.sh`)

**Utilisation:**
```bash
./check-install.sh
```

**Ce qu'il vérifie:**
- ✓ Installation de l'AppImage
- ✓ Liens symboliques
- ✓ Dépendances système
- ✓ Installation d'ampy
- ✓ Groupes utilisateur
- ✓ Règles USB
- ✓ Détection du Raspberry Pi Pico
- ✓ Permissions sur les ports série

Très utile pour diagnostiquer les problèmes après installation !

### 4. Script de Création de Package (`create-package.sh`)

**Utilisation:**
```bash
./create-package.sh
```

**Ce qu'il fait:**
- 📦 Trouve l'AppImage (dans `dist/` ou répertoire courant)
- 📦 Crée une structure de distribution
- 📦 Copie tous les fichiers nécessaires
- 📦 Crée une archive `.tar.gz`
- 📦 Génère un checksum SHA256

**Résultat:**
```
robotpi-ide-1.0.0-debian12.tar.gz
robotpi-ide-1.0.0-debian12.tar.gz.sha256
```

### 5. Makefile

**Commandes disponibles:**

```bash
# Afficher l'aide
make help

# Installer (nécessite sudo)
sudo make install

# Désinstaller (nécessite sudo)
sudo make uninstall

# Vérifier l'installation
make check

# Compiler l'AppImage (si sources disponibles)
make build

# Créer un package de distribution
make package

# Nettoyer
make clean
```

## 📝 Workflow de Distribution

### Étape 1: Compiler l'AppImage

```bash
# Cloner le dépôt
git clone https://github.com/matelec/RobotPi-IDE.git
cd RobotPi-IDE

# Installer les dépendances
npm install

# Compiler l'AppImage
npm run build:appimage
# Résultat dans dist/RobotPi-IDE-1.0.0.AppImage
```

### Étape 2: Créer le Package de Distribution

```bash
# Copier les scripts d'installation
cp path/to/install.sh .
cp path/to/uninstall.sh .
cp path/to/check-install.sh .
cp path/to/create-package.sh .

# Créer le package
chmod +x create-package.sh
./create-package.sh

# Résultat:
# - robotpi-ide-1.0.0-debian12.tar.gz
# - robotpi-ide-1.0.0-debian12.tar.gz.sha256
```

### Étape 3: Distribuer

**Option A: GitHub Releases**

1. Aller sur https://github.com/matelec/RobotPi-IDE/releases
2. Créer une nouvelle release
3. Upload l'archive `.tar.gz` et le checksum `.sha256`
4. Ajouter les notes de version

**Option B: Site Web**

```bash
# Upload sur votre serveur
scp robotpi-ide-1.0.0-debian12.tar.gz* user@server:/var/www/downloads/
```

**Option C: Partage Direct**

Envoyez l'archive directement aux utilisateurs par email, USB, etc.

## 👥 Instructions pour les Utilisateurs

### Installation Simple

```bash
# Télécharger et extraire
wget https://example.com/robotpi-ide-1.0.0-debian12.tar.gz
tar -xzf robotpi-ide-1.0.0-debian12.tar.gz
cd robotpi-ide-installer

# Vérifier le checksum (optionnel mais recommandé)
sha256sum -c robotpi-ide-1.0.0-debian12.tar.gz.sha256

# Installer
sudo ./install.sh

# Vérifier l'installation
./check-install.sh

# Redémarrer la session pour les permissions
# Puis lancer l'application
robotpi-ide
```

### Installation Ultra-Rapide

```bash
# Extraction et installation en une ligne
tar -xzf robotpi-ide-1.0.0-debian12.tar.gz && \
cd robotpi-ide-installer && \
sudo ./quick-install.sh
```

## 🔧 Personnalisation des Scripts

### Modifier la Version

Dans `create-package.sh`:
```bash
VERSION="1.0.1"  # Changer ici
```

### Modifier le Répertoire d'Installation

Dans `install.sh`:
```bash
INSTALL_DIR="/opt/robotpi-ide"  # Changer ici
```

### Ajouter des Dépendances

Dans `install.sh`, section `install_dependencies()`:
```bash
apt-get install -y \
    fuse \
    libfuse2 \
    python3 \
    # Ajouter vos dépendances ici
    ma-nouvelle-dependance
```

### Modifier les Règles USB

Dans `install.sh`, section `setup_usb_permissions()`:
```bash
cat > /etc/udev/rules.d/99-pico.rules <<'EOF'
# Vos règles personnalisées ici
EOF
```

## 📊 Statistiques et Logs

### Vérifier les Logs d'Installation

```bash
# Logs système
journalctl -xe | grep robotpi

# Logs udev (pour USB)
journalctl -u udev | grep -i pico
```

### Tester Manuellement

```bash
# Tester l'AppImage
/opt/robotpi-ide/robotpi-ide.AppImage

# Tester ampy
ampy --help

# Lister les ports série
ls -la /dev/ttyACM* /dev/ttyUSB*

# Vérifier les permissions
groups $USER
```

## 🐛 Résolution de Problèmes Courants

### Problème: "AppImage non trouvée"

**Solution:**
```bash
# Le fichier .AppImage doit être dans le même répertoire que install.sh
ls -la *.AppImage
# Si absent, téléchargez-le ou compilez-le
```

### Problème: "Permission denied" après installation

**Solution:**
```bash
# L'utilisateur doit se déconnecter/reconnecter
# Ou forcer le rechargement des groupes:
newgrp dialout
```

### Problème: ampy non trouvé

**Solution:**
```bash
# Installer manuellement
pip3 install --break-system-packages adafruit-ampy

# Ou via Python
python3 -m pip install adafruit-ampy
```

## 📚 Ressources Additionnelles

- **Documentation complète**: Inclure un lien vers docs.md
- **Tutoriels vidéo**: Lien YouTube si disponible
- **Forum de support**: Discord/Forum/GitHub Discussions
- **Exemples de projets**: Dépôt GitHub avec exemples

## ✅ Checklist Avant Distribution

- [ ] AppImage compilée et testée
- [ ] Scripts d'installation testés sur Debian 12 propre
- [ ] Documentation à jour (README, CHANGELOG)
- [ ] Version correcte dans tous les fichiers
- [ ] Checksum SHA256 généré
- [ ] Testé sur machine virtuelle ou conteneur Docker
- [ ] Icônes et ressources incluses
- [ ] Licence MIT incluse

## 📄 Licence

MIT License - Copyright (c) RATTE MATTHIAS

---

**Bonne distribution ! 🎉**
