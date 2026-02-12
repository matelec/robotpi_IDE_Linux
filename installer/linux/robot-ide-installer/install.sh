#!/bin/bash
###############################################################################
# Script d'installation de RobotPi IDE pour Debian 12
# Version: 1.0.0
# Auteur: RATTE MATTHIAS
###############################################################################

set -e  # Arrêter en cas d'erreur

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_NAME="RobotPi IDE"
APP_ID="robotpi-ide"
INSTALL_DIR="/opt/robotpi-ide"
DESKTOP_FILE="/usr/share/applications/robotpi-ide.desktop"
ICON_DIR="/usr/share/icons/hicolor"
APPIMAGE_NAME="RobotPi-IDE-1.0.0.AppImage"

###############################################################################
# Fonctions utilitaires
###############################################################################

print_header() {
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║           Installation de RobotPi IDE v1.0.0              ║"
    echo "║        Interface de programmation pour Raspberry Pi Pico  ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_step() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[ℹ]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

check_root() {
    if [ "$EUID" -ne 0 ]; then 
        print_error "Ce script doit être exécuté en tant que root"
        echo "Utilisez: sudo $0"
        exit 1
    fi
}

check_debian() {
    if [ ! -f /etc/debian_version ]; then
        print_error "Ce script est conçu pour Debian/Ubuntu"
        exit 1
    fi
    
    local version=$(cat /etc/debian_version | cut -d. -f1)
    print_info "Détection: Debian/Ubuntu version $version"
}

###############################################################################
# Installation des dépendances
###############################################################################

install_dependencies() {
    print_info "Installation des dépendances système..."
    
    apt-get update
    
    # Dépendances pour AppImage
    apt-get install -y \
        fuse \
        libfuse2 \
        python3 \
        python3-pip \
        python3-venv \
        usbutils \
        wget \
        curl
    
    print_step "Dépendances système installées"
}

install_ampy() {
    print_info "Installation d'ampy (Adafruit MicroPython Tool)..."
    
    # Installer ampy pour Python 3
    pip3 install --break-system-packages adafruit-ampy || \
    pip3 install adafruit-ampy
    
    # Vérifier l'installation
    if command -v ampy &> /dev/null; then
        local ampy_version=$(ampy --version 2>&1 || echo "version inconnue")
        print_step "ampy installé: $ampy_version"
    else
        print_warning "ampy installé mais non trouvé dans PATH"
        print_info "Vous devrez peut-être redémarrer votre session"
    fi
}

###############################################################################
# Configuration des permissions USB
###############################################################################

setup_usb_permissions() {
    print_info "Configuration des permissions USB pour le Raspberry Pi Pico..."
    
    # Créer les règles udev pour le Pico
    cat > /etc/udev/rules.d/99-pico.rules <<'EOF'
# Raspberry Pi Pico
SUBSYSTEMS=="usb", ATTRS{idVendor}=="2e8a", ATTRS{idProduct}=="0005", MODE:="0666", GROUP="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="2e8a", ATTRS{idProduct}=="0004", MODE:="0666", GROUP="plugdev"
SUBSYSTEMS=="usb", ATTRS{idVendor}=="2e8a", MODE:="0666", GROUP="plugdev"

# MicroPython
SUBSYSTEMS=="usb", ATTRS{idVendor}=="f055", MODE:="0666", GROUP="plugdev"
EOF

    # Recharger les règles udev
    udevadm control --reload-rules
    udevadm trigger
    
    print_step "Permissions USB configurées"
    print_info "Les utilisateurs doivent être dans le groupe 'dialout' et 'plugdev'"
}

add_user_to_groups() {
    local username="$1"
    
    if [ -z "$username" ]; then
        print_warning "Aucun utilisateur spécifié pour les groupes"
        return
    fi
    
    print_info "Ajout de l'utilisateur '$username' aux groupes nécessaires..."
    
    usermod -a -G dialout "$username" 2>/dev/null || true
    usermod -a -G plugdev "$username" 2>/dev/null || true
    
    print_step "Utilisateur '$username' ajouté aux groupes dialout et plugdev"
    print_warning "L'utilisateur devra se déconnecter/reconnecter pour que les changements prennent effet"
}

###############################################################################
# Installation de l'AppImage
###############################################################################

install_appimage() {
    print_info "Installation de l'AppImage..."
    
    # Créer le répertoire d'installation
    mkdir -p "$INSTALL_DIR"
    
    # Chercher l'AppImage
    local appimage_path=""
    
    # 1. Chercher dans le répertoire du script
    if [ -f "$SCRIPT_DIR/$APPIMAGE_NAME" ]; then
        appimage_path="$SCRIPT_DIR/$APPIMAGE_NAME"
    # 2. Chercher un fichier .AppImage
    elif [ -f "$SCRIPT_DIR"/*.AppImage ]; then
        appimage_path=$(ls "$SCRIPT_DIR"/*.AppImage | head -n 1)
    else
        print_error "AppImage non trouvée dans $SCRIPT_DIR"
        print_info "Veuillez placer le fichier .AppImage dans le même répertoire que ce script"
        exit 1
    fi
    
    print_info "AppImage trouvée: $(basename "$appimage_path")"
    
    # Copier l'AppImage
    cp "$appimage_path" "$INSTALL_DIR/robotpi-ide.AppImage"
    chmod +x "$INSTALL_DIR/robotpi-ide.AppImage"
    
    # Créer un lien symbolique dans /usr/local/bin
    ln -sf "$INSTALL_DIR/robotpi-ide.AppImage" /usr/local/bin/robotpi-ide
    
    print_step "AppImage installée dans $INSTALL_DIR"
}

###############################################################################
# Installation de l'icône
###############################################################################

install_icon() {
    print_info "Installation de l'icône..."
    
    # Créer l'icône si elle n'existe pas
    local icon_path="$SCRIPT_DIR/icon.png"
    
    if [ ! -f "$icon_path" ]; then
        # Créer une icône par défaut (emoji robot en PNG)
        print_info "Création d'une icône par défaut..."
        # On pourrait extraire l'icône de l'AppImage ici
    fi
    
    # Installer l'icône dans plusieurs tailles
    for size in 16 32 48 64 128 256; do
        local icon_dir="$ICON_DIR/${size}x${size}/apps"
        mkdir -p "$icon_dir"
        
        if [ -f "$icon_path" ]; then
            # Si ImageMagick est disponible, redimensionner
            if command -v convert &> /dev/null; then
                convert "$icon_path" -resize ${size}x${size} "$icon_dir/$APP_ID.png" 2>/dev/null || \
                cp "$icon_path" "$icon_dir/$APP_ID.png"
            else
                cp "$icon_path" "$icon_dir/$APP_ID.png"
            fi
        fi
    done
    
    print_step "Icône installée"
}

###############################################################################
# Création du lanceur
###############################################################################

create_desktop_entry() {
    print_info "Création du lanceur d'application..."
    
    cat > "$DESKTOP_FILE" <<EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=RobotPi IDE
GenericName=Robot Programming IDE
Comment=Interface de programmation visuelle pour Raspberry Pi Pico
Exec=/usr/local/bin/robotpi-ide %U
Icon=$APP_ID
Terminal=false
Categories=Development;Education;Electronics;
Keywords=robot;pico;micropython;blockly;education;
StartupNotify=true
MimeType=application/x-robotpi-project;
StartupWMClass=robotpi-ide
EOF

    chmod 644 "$DESKTOP_FILE"
    
    # Mettre à jour le cache des applications
    if command -v update-desktop-database &> /dev/null; then
        update-desktop-database /usr/share/applications
    fi
    
    print_step "Lanceur créé: $DESKTOP_FILE"
}

###############################################################################
# Post-installation
###############################################################################

post_install() {
    print_info "Configuration post-installation..."
    
    # Mettre à jour le cache des icônes
    if command -v gtk-update-icon-cache &> /dev/null; then
        gtk-update-icon-cache -f -t "$ICON_DIR" 2>/dev/null || true
    fi
    
    # Créer un fichier de version
    echo "1.0.0" > "$INSTALL_DIR/VERSION"
    
    print_step "Configuration post-installation terminée"
}

###############################################################################
# Affichage des informations finales
###############################################################################

show_completion() {
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║         Installation terminée avec succès ! 🎉            ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    print_info "RobotPi IDE est maintenant installé sur votre système"
    echo ""
    echo "📍 Emplacement: $INSTALL_DIR"
    echo "🚀 Lancement: robotpi-ide (depuis le terminal)"
    echo "📱 Menu: Cherchez 'RobotPi IDE' dans vos applications"
    echo ""
    print_warning "IMPORTANT:"
    echo "  1. Déconnectez-vous et reconnectez-vous pour que les permissions USB prennent effet"
    echo "  2. Connectez votre Raspberry Pi Pico via USB"
    echo "  3. Le port série devrait apparaître comme /dev/ttyACM0 ou /dev/ttyUSB0"
    echo ""
    print_info "Pour désinstaller: sudo $SCRIPT_DIR/uninstall.sh"
    echo ""
}

###############################################################################
# Fonction principale
###############################################################################

main() {
    print_header
    
    check_root
    check_debian
    
    echo ""
    print_info "Début de l'installation..."
    echo ""
    
    # Demander le nom d'utilisateur
    if [ -z "$SUDO_USER" ]; then
        read -p "Nom d'utilisateur pour les permissions USB: " target_user
    else
        target_user="$SUDO_USER"
        print_info "Utilisateur détecté: $target_user"
    fi
    
    echo ""
    
    # Étapes d'installation
    install_dependencies
    install_ampy
    setup_usb_permissions
    add_user_to_groups "$target_user"
    install_appimage
    install_icon
    create_desktop_entry
    post_install
    
    show_completion
}

# Exécuter le script
main "$@"
