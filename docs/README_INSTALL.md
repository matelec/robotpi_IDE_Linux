# 📦 Installation de RobotPi IDE sur Debian 12

Ce guide vous explique comment installer RobotPi IDE sur Debian 12 (ou distributions basées sur Debian/Ubuntu).

## 📋 Prérequis

- Debian 12 (Bookworm) ou Ubuntu 22.04+
- Accès root (sudo)
- Connexion Internet (pour télécharger les dépendances)

## 🚀 Installation rapide

### 1. Télécharger le package

```bash
# Téléchargez ou clonez le dépôt
git clone https://github.com/matelec/RobotPi-IDE.git
cd RobotPi-IDE
```

### 2. Placer l'AppImage

Assurez-vous que le fichier `.AppImage` est dans le même répertoire que le script d'installation :

```bash
ls -la *.AppImage
# Devrait afficher: RobotPi-IDE-1.0.0.AppImage (ou similaire)
```

### 3. Lancer l'installation

```bash
chmod +x install.sh
sudo ./install.sh
```

Le script va :
- ✅ Installer les dépendances système
- ✅ Installer ampy (outil MicroPython)
- ✅ Configurer les permissions USB
- ✅ Installer l'AppImage dans `/opt/robotpi-ide`
- ✅ Créer un lanceur dans le menu applications
- ✅ Ajouter votre utilisateur aux groupes nécessaires

### 4. Redémarrer la session

**IMPORTANT**: Déconnectez-vous et reconnectez-vous pour que les permissions USB prennent effet.

```bash
# Ou redémarrez complètement
sudo reboot
```

## 🎯 Utilisation

### Lancer depuis le terminal

```bash
robotpi-ide
```

### Lancer depuis le menu

Cherchez "RobotPi IDE" dans votre menu d'applications (Catégories: Développement / Éducation)

## 🔌 Configuration USB

### Vérifier la connexion du Pico

```bash
# Connectez votre Raspberry Pi Pico
lsusb | grep -i "2e8a\|MicroPython\|Raspberry"

# Vérifier le port série
ls -la /dev/ttyACM* /dev/ttyUSB*
```

### Tester les permissions

```bash
# Vous devriez avoir accès sans sudo
cat /dev/ttyACM0
# Pressez Ctrl+C pour arrêter
```

### Groupes utilisateur

Vérifiez que vous êtes dans les bons groupes :

```bash
groups $USER
# Devrait contenir: dialout plugdev
```

## 🛠️ Dépannage

### Problème 1: "Permission denied" sur /dev/ttyACM0

**Solution**:
```bash
# Ajouter manuellement aux groupes
sudo usermod -a -G dialout $USER
sudo usermod -a -G plugdev $USER

# Recharger les règles udev
sudo udevadm control --reload-rules
sudo udevadm trigger

# Se déconnecter/reconnecter
```

### Problème 2: ampy non trouvé

**Solution**:
```bash
# Installer manuellement
pip3 install --break-system-packages adafruit-ampy

# Vérifier
which ampy
ampy --help
```

### Problème 3: AppImage ne se lance pas

**Solution**:
```bash
# Installer FUSE
sudo apt-get install fuse libfuse2

# Rendre exécutable
chmod +x /opt/robotpi-ide/robotpi-ide.AppImage

# Tester manuellement
/opt/robotpi-ide/robotpi-ide.AppImage
```

### Problème 4: Le Pico n'est pas détecté

**Solutions**:

1. **Vérifier le câble USB**: Utilisez un câble USB avec données (pas uniquement charge)

2. **Mode bootloader**: 
   - Débranchez le Pico
   - Maintenez le bouton BOOTSEL enfoncé
   - Rebranchez le Pico
   - Relâchez BOOTSEL
   - Il devrait apparaître comme `/dev/ttyACM0`

3. **Vérifier les règles udev**:
```bash
cat /etc/udev/rules.d/99-pico.rules
```

4. **Recharger les règles**:
```bash
sudo udevadm control --reload-rules
sudo udevadm trigger
```

## 🗑️ Désinstallation

```bash
sudo ./uninstall.sh
```

Le script de désinstallation vous demandera si vous voulez aussi supprimer :
- Les règles USB pour le Pico
- L'outil ampy

## 📂 Structure d'installation

```
/opt/robotpi-ide/
├── robotpi-ide.AppImage    # Application principale
└── VERSION                  # Numéro de version

/usr/local/bin/
└── robotpi-ide             # Lien symbolique

/usr/share/applications/
└── robotpi-ide.desktop     # Lanceur

/usr/share/icons/hicolor/
└── */apps/robotpi-ide.png  # Icônes (plusieurs tailles)

/etc/udev/rules.d/
└── 99-pico.rules           # Règles USB pour le Pico
```

## 🔄 Mise à jour

Pour mettre à jour vers une nouvelle version :

```bash
# Désinstaller l'ancienne version
sudo ./uninstall.sh

# Télécharger la nouvelle version
# ...

# Réinstaller
sudo ./install.sh
```

## 📝 Fichiers inclus

- `install.sh` - Script d'installation principal
- `uninstall.sh` - Script de désinstallation
- `RobotPi-IDE-*.AppImage` - Application (à télécharger)
- `README_INSTALL.md` - Ce fichier
- `icon.png` - Icône de l'application (optionnel)

## 🐛 Signaler un problème

Si vous rencontrez un problème :

1. Vérifiez les logs :
```bash
journalctl -xe | grep robotpi
```

2. Testez l'AppImage directement :
```bash
/opt/robotpi-ide/robotpi-ide.AppImage
```

3. Ouvrez une issue sur GitHub avec :
   - Version de Debian/Ubuntu : `cat /etc/os-release`
   - Logs d'erreur
   - Résultat de `lsusb` et `ls -la /dev/ttyACM*`

## 📚 Documentation

- [Documentation RobotPi IDE](https://github.com/matelec/RobotPi-IDE)
- [Documentation MicroPython](https://docs.micropython.org/)
- [Documentation Raspberry Pi Pico](https://www.raspberrypi.com/documentation/microcontrollers/raspberry-pi-pico.html)

## 📄 Licence

MIT License - Copyright (c) RATTE MATTHIAS

---

**Bon développement avec RobotPi IDE ! 🤖🚀**
