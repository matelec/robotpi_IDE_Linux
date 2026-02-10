# 📦 Scripts d'Installation RobotPi IDE pour Debian 12

## 🎯 Vue d'Ensemble

Ce package contient tous les scripts nécessaires pour installer, désinstaller et distribuer RobotPi IDE sur Debian 12 et distributions compatibles (Ubuntu 22.04+).

## 📁 Fichiers Fournis

### Scripts Principaux

| Fichier | Description | Usage |
|---------|-------------|-------|
| `install.sh` | Script d'installation principal | `sudo ./install.sh` |
| `uninstall.sh` | Script de désinstallation | `sudo ./uninstall.sh` |
| `check-install.sh` | Vérification post-installation | `./check-install.sh` |
| `create-package.sh` | Création du package de distribution | `./create-package.sh` |

### Documentation

| Fichier | Description |
|---------|-------------|
| `README_INSTALL.md` | Guide d'installation pour utilisateurs |
| `DISTRIBUTION_GUIDE.md` | Guide de distribution pour développeurs |
| `README_FIX.md` | Correction du bug AppImage (référence) |

### Outils Supplémentaires

| Fichier | Description |
|---------|-------------|
| `Makefile` | Commandes Make simplifiées |
| `Dockerfile` | Tests d'installation dans conteneur |

## 🚀 Utilisation Rapide

### Pour les Utilisateurs Finaux

```bash
# 1. Extraire l'archive
tar -xzf robotpi-ide-1.0.0-debian12.tar.gz
cd robotpi-ide-installer

# 2. Installer
sudo ./install.sh

# 3. Vérifier
./check-install.sh

# 4. Lancer
robotpi-ide
```

### Pour les Développeurs/Distributeurs

```bash
# 1. Compiler l'AppImage
npm run build:appimage

# 2. Créer le package de distribution
./create-package.sh

# 3. Tester dans Docker (optionnel)
docker build -t robotpi-test .
docker run -it robotpi-test /tmp/test-installation.sh

# 4. Distribuer
# Upload sur GitHub Releases, site web, etc.
```

## 🔧 Caractéristiques des Scripts

### install.sh

**Fonctionnalités:**
- ✅ Vérification du système (Debian/Ubuntu)
- ✅ Installation automatique des dépendances
- ✅ Configuration d'ampy (MicroPython)
- ✅ Configuration USB (règles udev)
- ✅ Gestion des groupes utilisateur
- ✅ Installation de l'AppImage
- ✅ Création du lanceur
- ✅ Installation des icônes
- ✅ Messages colorés et informatifs

**Fichiers créés/modifiés:**
```
/opt/robotpi-ide/robotpi-ide.AppImage
/usr/local/bin/robotpi-ide
/usr/share/applications/robotpi-ide.desktop
/usr/share/icons/hicolor/*/apps/robotpi-ide.png
/etc/udev/rules.d/99-pico.rules
```

**Groupes ajoutés:**
- `dialout` - Accès aux ports série
- `plugdev` - Accès aux périphériques USB

### uninstall.sh

**Fonctionnalités:**
- 🗑️ Suppression complète de l'application
- 🗑️ Suppression du lanceur et des icônes
- ❓ Option de conserver les règles USB
- ❓ Option de conserver ampy
- ✅ Confirmation avant suppression

### check-install.sh

**Vérifications:**
- ✓ Présence de l'AppImage
- ✓ Liens symboliques
- ✓ Dépendances système (Python, pip, fuse)
- ✓ Installation d'ampy
- ✓ Groupes utilisateur
- ✓ Règles USB
- ✓ Détection du Raspberry Pi Pico
- ✓ Permissions des ports série

**Sortie:**
- Messages colorés (✓ succès, ✗ erreur, ⚠ avertissement)
- Recommandations d'actions
- Aide au diagnostic

### create-package.sh

**Fonctionnalités:**
- 📦 Recherche automatique de l'AppImage
- 📦 Création de la structure de distribution
- 📦 Copie de tous les fichiers nécessaires
- 📦 Génération de l'archive .tar.gz
- 📦 Calcul du checksum SHA256
- 📦 Documentation intégrée (README, CHANGELOG)

**Résultat:**
```
robotpi-ide-1.0.0-debian12.tar.gz
robotpi-ide-1.0.0-debian12.tar.gz.sha256
```

## 📊 Matrice de Compatibilité

| Distribution | Version | Testé | Notes |
|--------------|---------|-------|-------|
| Debian | 12 (Bookworm) | ✅ | Recommandé |
| Ubuntu | 22.04 LTS | ✅ | Supporté |
| Ubuntu | 24.04 LTS | ✅ | Supporté |
| Linux Mint | 21+ | ⚠️ | Non testé (devrait fonctionner) |
| Pop!_OS | 22.04+ | ⚠️ | Non testé (devrait fonctionner) |

## 🧪 Tests Automatisés

### Test avec Docker

```bash
# Construire l'image de test
docker build -t robotpi-test .

# Exécuter les tests automatiques
docker run -it --rm robotpi-test /tmp/test-installation.sh

# Tests manuels interactifs
docker run -it --rm robotpi-test bash
```

### Test avec Make

```bash
# Installer
sudo make install

# Vérifier
make check

# Désinstaller
sudo make uninstall
```

## 📝 Checklist de Distribution

### Avant de Distribuer

- [ ] AppImage compilée et fonctionnelle
- [ ] Version correcte dans tous les fichiers
- [ ] Scripts testés sur Debian 12 propre
- [ ] README à jour
- [ ] CHANGELOG complet
- [ ] Checksum SHA256 généré
- [ ] Tests Docker passés
- [ ] Icônes incluses

### Canaux de Distribution

- [ ] GitHub Releases
- [ ] Site web officiel
- [ ] Documentation mise à jour
- [ ] Annonce sur forums/réseaux sociaux

## 🔐 Sécurité

### Vérification de l'Intégrité

```bash
# Vérifier le checksum SHA256
sha256sum -c robotpi-ide-1.0.0-debian12.tar.gz.sha256
```

### Signature GPG (Optionnel)

```bash
# Signer l'archive
gpg --detach-sign --armor robotpi-ide-1.0.0-debian12.tar.gz

# Vérifier la signature
gpg --verify robotpi-ide-1.0.0-debian12.tar.gz.asc
```

## 🐛 Signalement de Bugs

Si vous trouvez un bug dans les scripts d'installation :

1. Exécuter `./check-install.sh` et noter la sortie
2. Vérifier les logs: `journalctl -xe | grep robotpi`
3. Créer une issue sur GitHub avec :
   - Version de Debian/Ubuntu
   - Sortie de `check-install.sh`
   - Logs d'erreur
   - Étapes pour reproduire

## 📞 Support

- **GitHub Issues**: https://github.com/matelec/RobotPi-IDE/issues
- **Documentation**: Voir README_INSTALL.md
- **Email**: [votre-email]

## 📄 Licence

MIT License - Copyright (c) RATTE MATTHIAS

Tous les scripts d'installation sont fournis sous licence MIT.

## 🙏 Remerciements

Merci d'utiliser RobotPi IDE ! Ces scripts ont été créés pour faciliter l'installation et la distribution de l'application.

---

**Version des Scripts**: 1.0.0  
**Date de Création**: $(date +%Y-%m-%d)  
**Auteur**: RATTE MATTHIAS

---

## 📚 Ressources Supplémentaires

- [Guide d'Installation](README_INSTALL.md) - Pour les utilisateurs
- [Guide de Distribution](DISTRIBUTION_GUIDE.md) - Pour les développeurs
- [Correction Bug AppImage](README_FIX.md) - Notes techniques

**Note**: Gardez ces scripts à jour avec chaque nouvelle version de RobotPi IDE !
