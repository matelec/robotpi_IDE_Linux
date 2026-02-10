#!/bin/bash
###############################################################################
# Script de création d'un package de distribution pour RobotPi IDE
# Crée une archive prête à être distribuée avec tous les fichiers nécessaires
###############################################################################

set -e

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIST_DIR="robotpi-ide-installer"
VERSION="1.0.0"

print_step() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[ℹ]${NC} $1"
}

print_header() {
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║     Création du package de distribution RobotPi IDE       ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Vérifier que l'AppImage existe
check_appimage() {
    print_info "Recherche de l'AppImage..."
    
    local appimage=""
    
    # Déterminer le répertoire racine du projet
    # Si on est dans installer/linux/, remonter de 2 niveaux
    local project_root="$SCRIPT_DIR"
    if [[ "$SCRIPT_DIR" == */installer/linux ]]; then
        project_root="$(cd "$SCRIPT_DIR/../.." && pwd)"
    fi
    
    print_info "Répertoire du projet: $project_root"
    
    # Chercher dans dist/ à la racine du projet
    if [ -d "$project_root/dist" ]; then
        appimage=$(find "$project_root/dist" -name "*.AppImage" | head -n 1)
        if [ -n "$appimage" ]; then
            print_info "AppImage trouvée dans dist/"
        fi
    fi
    
    # Chercher dans le répertoire du script
    if [ -z "$appimage" ]; then
        appimage=$(find "$SCRIPT_DIR" -maxdepth 1 -name "*.AppImage" | head -n 1)
        if [ -n "$appimage" ]; then
            print_info "AppImage trouvée dans le répertoire du script"
        fi
    fi
    
    # Chercher dans le répertoire racine du projet
    if [ -z "$appimage" ]; then
        appimage=$(find "$project_root" -maxdepth 1 -name "*.AppImage" | head -n 1)
        if [ -n "$appimage" ]; then
            print_info "AppImage trouvée à la racine du projet"
        fi
    fi
    
    if [ -z "$appimage" ]; then
        echo -e "${YELLOW}⚠️  Aucune AppImage trouvée${NC}"
        echo ""
        echo "Chemins recherchés:"
        echo "  - $project_root/dist/"
        echo "  - $SCRIPT_DIR/"
        echo "  - $project_root/"
        echo ""
        echo "Options:"
        echo "  1. Compiler l'AppImage depuis la racine du projet:"
        echo "     cd $project_root && npm run build:appimage"
        echo "  2. Télécharger l'AppImage depuis les releases GitHub"
        echo "  3. Placer un fichier .AppImage dans dist/"
        echo ""
        exit 1
    fi
    
    echo "$appimage"
}

# Créer le package
create_package() {
    print_header
    
    # Nettoyer l'ancien package
    if [ -d "$DIST_DIR" ]; then
        print_info "Nettoyage de l'ancien package..."
        rm -rf "$DIST_DIR"
    fi
    
    # Créer le répertoire dans le dossier temporaire ou à la racine du projet
    print_info "Création de la structure..."
    
    # Créer dans le répertoire racine du projet pour faciliter l'accès
    local package_dir="$project_root/$DIST_DIR"
    mkdir -p "$package_dir"
    
    # Utiliser ce répertoire pour la suite
    DIST_DIR="$package_dir"
    
    # Trouver l'AppImage
    local appimage=$(check_appimage)
    print_step "AppImage trouvée: $(basename "$appimage")"
    
    # Copier l'AppImage
    print_info "Copie de l'AppImage..."
    cp "$appimage" "$DIST_DIR/RobotPi-IDE-${VERSION}.AppImage"
    chmod +x "$DIST_DIR/RobotPi-IDE-${VERSION}.AppImage"
    
    # Copier les scripts (ils sont dans le même répertoire que create-package.sh)
    print_info "Copie des scripts d'installation..."
    
    if [ -f "$SCRIPT_DIR/install.sh" ]; then
        cp "$SCRIPT_DIR/install.sh" "$DIST_DIR/"
    else
        echo -e "${YELLOW}⚠️  install.sh non trouvé dans $SCRIPT_DIR${NC}"
    fi
    
    if [ -f "$SCRIPT_DIR/uninstall.sh" ]; then
        cp "$SCRIPT_DIR/uninstall.sh" "$DIST_DIR/"
    else
        echo -e "${YELLOW}⚠️  uninstall.sh non trouvé${NC}"
    fi
    
    if [ -f "$SCRIPT_DIR/check-install.sh" ]; then
        cp "$SCRIPT_DIR/check-install.sh" "$DIST_DIR/"
    else
        echo -e "${YELLOW}⚠️  check-install.sh non trouvé${NC}"
    fi
    
    # Rendre les scripts exécutables
    chmod +x "$DIST_DIR"/*.sh
    
    # Copier la documentation
    print_info "Copie de la documentation..."
    
    # Chercher le README à différents endroits
    if [ -f "$SCRIPT_DIR/README.md" ]; then
        cp "$SCRIPT_DIR/README.md" "$DIST_DIR/"
    elif [ -f "$project_root/installer/linux/README.md" ]; then
        cp "$project_root/installer/linux/README.md" "$DIST_DIR/"
    elif [ -f "$project_root/README_INSTALL.md" ]; then
        cp "$project_root/README_INSTALL.md" "$DIST_DIR/README.md"
    else
        echo -e "${YELLOW}⚠️  README non trouvé, création d'un README basique${NC}"
        cat > "$DIST_DIR/README.md" <<EOF
# RobotPi IDE - Installation pour Debian 12

## Installation

\`\`\`bash
sudo ./install.sh
\`\`\`

## Vérification

\`\`\`bash
./check-install.sh
\`\`\`

Voir la documentation complète sur GitHub: https://github.com/matelec/RobotPi-IDE
EOF
    fi
    
    # Copier l'icône si elle existe
    if [ -f "$project_root/assets/icon.png" ]; then
        cp "$project_root/assets/icon.png" "$DIST_DIR/"
    elif [ -f "$SCRIPT_DIR/icon.png" ]; then
        cp "$SCRIPT_DIR/icon.png" "$DIST_DIR/"
    elif [ -f "$project_root/icon.png" ]; then
        cp "$project_root/icon.png" "$DIST_DIR/"
    fi
    
    # Créer un fichier VERSION
    echo "$VERSION" > "$DIST_DIR/VERSION"
    
    # Créer un script de lancement rapide
    cat > "$DIST_DIR/quick-install.sh" <<'EOF'
#!/bin/bash
# Installation rapide de RobotPi IDE

echo "╔════════════════════════════════════════════════════════════╗"
echo "║        Installation rapide de RobotPi IDE                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

if [ "$EUID" -ne 0 ]; then 
    echo "❌ Ce script doit être exécuté avec sudo"
    echo ""
    echo "Utilisez: sudo ./quick-install.sh"
    exit 1
fi

./install.sh

echo ""
echo "✅ Installation terminée !"
echo ""
echo "Pour vérifier l'installation: ./check-install.sh"
EOF
    
    chmod +x "$DIST_DIR/quick-install.sh"
    
    # Créer un fichier CHANGELOG
    cat > "$DIST_DIR/CHANGELOG.md" <<EOF
# Changelog RobotPi IDE

## Version ${VERSION} - $(date +%Y-%m-%d)

### Nouveautés
- Interface Blockly pour programmation visuelle
- Génération automatique de code Python
- Support du Raspberry Pi Pico (MicroPython)
- Téléversement direct via ampy
- Moniteur série intégré
- Gestion des fichiers sur le Pico
- Installation de la bibliothèque robotPi.py

### Fonctionnalités
- Blocs de mouvement (avancer, reculer, tourner)
- Blocs de capteurs (distance, obstacles)
- Blocs de lumières (LED RGB)
- Blocs de bouton (démarrage, arrêt)
- Blocs de temporisation
- Blocs standards (logique, boucles, mathématiques, texte)

### Configuration requise
- Debian 12 / Ubuntu 22.04+
- Python 3.9+
- Raspberry Pi Pico avec MicroPython

### Installation
\`\`\`bash
sudo ./install.sh
\`\`\`

### Support
- GitHub: https://github.com/matelec/RobotPi-IDE
- Issues: https://github.com/matelec/RobotPi-IDE/issues
EOF
    
    # Créer l'archive à la racine du projet
    print_info "Création de l'archive..."
    local archive_name="robotpi-ide-${VERSION}-debian12.tar.gz"
    local archive_path="$project_root/$archive_name"
    
    # Se placer dans le répertoire parent pour créer l'archive
    cd "$project_root"
    tar -czf "$archive_name" "$(basename "$DIST_DIR")"
    
    # Calculer le checksum
    print_info "Calcul du checksum..."
    sha256sum "$archive_name" > "${archive_name}.sha256"
    
    # Afficher le résumé
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║          Package créé avec succès ! 🎉                     ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    print_info "Archive: $archive_path"
    print_info "Taille: $(du -h "$archive_path" | cut -f1)"
    print_info "SHA256: $(cat "${archive_path}.sha256" | cut -d' ' -f1)"
    echo ""
    print_info "Emplacement:"
    echo "  📦 Archive: $archive_path"
    echo "  🔐 Checksum: ${archive_path}.sha256"
    echo "  📁 Dossier: $DIST_DIR"
    echo ""
    print_info "Contenu du package:"
    tar -tzf "$archive_path" | head -20
    if [ $(tar -tzf "$archive_path" | wc -l) -gt 20 ]; then
        echo "  ..."
    fi
    echo ""
    print_step "Package prêt pour la distribution !"
    echo ""
    echo "Pour installer sur une machine Debian 12:"
    echo "  1. Extraire: tar -xzf $(basename "$archive_path")"
    echo "  2. Installer: cd $(basename "$DIST_DIR") && sudo ./install.sh"
    echo ""
}

# Exécution
create_package
