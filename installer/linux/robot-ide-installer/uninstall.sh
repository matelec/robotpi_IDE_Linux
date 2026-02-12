#!/bin/bash
###############################################################################
# Script de désinstallation de RobotPi IDE pour Debian 12
# Version: 1.0.0
###############################################################################

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Variables
APP_ID="robotpi-ide"
INSTALL_DIR="/opt/robotpi-ide"
DESKTOP_FILE="/usr/share/applications/robotpi-ide.desktop"
ICON_DIR="/usr/share/icons/hicolor"
UDEV_RULES="/etc/udev/rules.d/99-pico.rules"

print_header() {
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║        Désinstallation de RobotPi IDE v1.0.0              ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_step() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[ℹ]${NC} $1"
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

confirm_uninstall() {
    echo ""
    echo -e "${YELLOW}⚠️  Cette action va supprimer RobotPi IDE de votre système${NC}"
    echo ""
    read -p "Voulez-vous continuer ? (o/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[OoYy]$ ]]; then
        print_info "Désinstallation annulée"
        exit 0
    fi
}

remove_appimage() {
    print_info "Suppression de l'application..."
    
    # Supprimer le lien symbolique
    if [ -L /usr/local/bin/robotpi-ide ]; then
        rm -f /usr/local/bin/robotpi-ide
        print_step "Lien symbolique supprimé"
    fi
    
    # Supprimer le répertoire d'installation
    if [ -d "$INSTALL_DIR" ]; then
        rm -rf "$INSTALL_DIR"
        print_step "Répertoire d'installation supprimé"
    fi
}

remove_desktop_entry() {
    print_info "Suppression du lanceur..."
    
    if [ -f "$DESKTOP_FILE" ]; then
        rm -f "$DESKTOP_FILE"
        print_step "Lanceur supprimé"
    fi
    
    # Mettre à jour la base de données
    if command -v update-desktop-database &> /dev/null; then
        update-desktop-database /usr/share/applications 2>/dev/null || true
    fi
}

remove_icons() {
    print_info "Suppression des icônes..."
    
    for size in 16 32 48 64 128 256; do
        local icon_file="$ICON_DIR/${size}x${size}/apps/$APP_ID.png"
        if [ -f "$icon_file" ]; then
            rm -f "$icon_file"
        fi
    done
    
    # Mettre à jour le cache des icônes
    if command -v gtk-update-icon-cache &> /dev/null; then
        gtk-update-icon-cache -f -t "$ICON_DIR" 2>/dev/null || true
    fi
    
    print_step "Icônes supprimées"
}

remove_udev_rules() {
    echo ""
    read -p "Supprimer les règles USB pour le Raspberry Pi Pico ? (o/N) " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[OoYy]$ ]]; then
        if [ -f "$UDEV_RULES" ]; then
            rm -f "$UDEV_RULES"
            udevadm control --reload-rules
            udevadm trigger
            print_step "Règles USB supprimées"
        fi
    else
        print_info "Règles USB conservées"
    fi
}

remove_ampy() {
    echo ""
    read -p "Désinstaller ampy (outil MicroPython) ? (o/N) " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[OoYy]$ ]]; then
        pip3 uninstall -y adafruit-ampy 2>/dev/null || true
        print_step "ampy désinstallé"
    else
        print_info "ampy conservé"
    fi
}

show_completion() {
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║       Désinstallation terminée avec succès ! 👋           ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    print_info "RobotPi IDE a été supprimé de votre système"
    echo ""
    print_info "Merci d'avoir utilisé RobotPi IDE !"
    echo ""
}

main() {
    print_header
    check_root
    confirm_uninstall
    
    echo ""
    print_info "Début de la désinstallation..."
    echo ""
    
    remove_appimage
    remove_desktop_entry
    remove_icons
    remove_udev_rules
    remove_ampy
    
    show_completion
}

main "$@"
