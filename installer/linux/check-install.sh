#!/bin/bash
###############################################################################
# Script de vérification de l'installation de RobotPi IDE
# Permet de diagnostiquer les problèmes après installation
###############################################################################

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║      Vérification de l'installation RobotPi IDE           ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

check_pass() {
    echo -e "${GREEN}  ✓${NC} $1"
}

check_fail() {
    echo -e "${RED}  ✗${NC} $1"
}

check_warn() {
    echo -e "${YELLOW}  ⚠${NC} $1"
}

check_info() {
    echo -e "${BLUE}  ℹ${NC} $1"
}

print_section() {
    echo ""
    echo -e "${BLUE}━━━ $1 ━━━${NC}"
}

# Fonction principale
main() {
    print_header
    
    # 1. Vérification de l'installation
    print_section "Installation de base"
    
    if [ -f "/opt/robotpi-ide/robotpi-ide.AppImage" ]; then
        check_pass "AppImage installée"
    else
        check_fail "AppImage non trouvée dans /opt/robotpi-ide/"
    fi
    
    if [ -L "/usr/local/bin/robotpi-ide" ]; then
        check_pass "Lien symbolique créé"
    else
        check_fail "Lien symbolique manquant"
    fi
    
    if [ -f "/usr/share/applications/robotpi-ide.desktop" ]; then
        check_pass "Lanceur d'application créé"
    else
        check_fail "Lanceur manquant"
    fi
    
    # 2. Vérification des dépendances
    print_section "Dépendances système"
    
    if command -v python3 &> /dev/null; then
        local py_version=$(python3 --version | cut -d' ' -f2)
        check_pass "Python 3 installé (version $py_version)"
    else
        check_fail "Python 3 non trouvé"
    fi
    
    if command -v pip3 &> /dev/null; then
        check_pass "pip3 installé"
    else
        check_fail "pip3 non trouvé"
    fi
    
    # 3. Vérification d'ampy
    print_section "Outil MicroPython (ampy)"
    
    if command -v ampy &> /dev/null; then
        check_pass "ampy installé et dans PATH"
        local ampy_path=$(which ampy)
        check_info "Chemin: $ampy_path"
    else
        check_fail "ampy non trouvé dans PATH"
        
        # Vérifier si installé mais pas dans PATH
        if python3 -m ampy --version &> /dev/null 2>&1; then
            check_warn "ampy accessible via 'python3 -m ampy'"
        fi
    fi
    
    # 4. Vérification des permissions USB
    print_section "Permissions et groupes utilisateur"
    
    local current_user=$(whoami)
    local user_groups=$(groups $current_user)
    
    if echo "$user_groups" | grep -q "dialout"; then
        check_pass "Utilisateur dans le groupe 'dialout'"
    else
        check_fail "Utilisateur PAS dans le groupe 'dialout'"
        check_info "Exécutez: sudo usermod -a -G dialout $current_user"
    fi
    
    if echo "$user_groups" | grep -q "plugdev"; then
        check_pass "Utilisateur dans le groupe 'plugdev'"
    else
        check_warn "Utilisateur PAS dans le groupe 'plugdev'"
        check_info "Exécutez: sudo usermod -a -G plugdev $current_user"
    fi
    
    # 5. Vérification des règles udev
    print_section "Règles USB (udev)"
    
    if [ -f "/etc/udev/rules.d/99-pico.rules" ]; then
        check_pass "Règles udev pour le Pico configurées"
        local rule_count=$(cat /etc/udev/rules.d/99-pico.rules | grep -c "SUBSYSTEMS")
        check_info "$rule_count règle(s) configurée(s)"
    else
        check_fail "Règles udev manquantes"
    fi
    
    # 6. Détection du Raspberry Pi Pico
    print_section "Détection du Raspberry Pi Pico"
    
    local pico_usb=$(lsusb | grep -i "2e8a\|MicroPython\|Raspberry")
    
    if [ -n "$pico_usb" ]; then
        check_pass "Pico détecté sur USB"
        check_info "$pico_usb"
    else
        check_warn "Aucun Pico détecté sur USB"
        check_info "Connectez votre Raspberry Pi Pico"
    fi
    
    # Vérifier les ports série
    local serial_ports=$(ls /dev/ttyACM* /dev/ttyUSB* 2>/dev/null)
    
    if [ -n "$serial_ports" ]; then
        check_pass "Port(s) série détecté(s):"
        for port in $serial_ports; do
            if [ -r "$port" ] && [ -w "$port" ]; then
                check_pass "  $port (lecture/écriture OK)"
            else
                check_warn "  $port (permissions insuffisantes)"
            fi
        done
    else
        check_warn "Aucun port série détecté"
    fi
    
    # 7. Test de lancement
    print_section "Test de l'application"
    
    if command -v robotpi-ide &> /dev/null; then
        check_pass "Commande 'robotpi-ide' accessible"
        check_info "Vous pouvez lancer l'application avec: robotpi-ide"
    else
        check_fail "Commande 'robotpi-ide' non accessible"
    fi
    
    # 8. Résumé et recommandations
    print_section "Résumé et recommandations"
    
    echo ""
    
    # Compter les erreurs
    local needs_relogin=false
    
    if ! echo "$user_groups" | grep -q "dialout" || ! echo "$user_groups" | grep -q "plugdev"; then
        needs_relogin=true
    fi
    
    if [ "$needs_relogin" = true ]; then
        echo -e "${YELLOW}⚠️  ACTION REQUISE:${NC}"
        echo "   Déconnectez-vous et reconnectez-vous pour que les changements"
        echo "   de groupes prennent effet."
        echo ""
    fi
    
    if [ -z "$serial_ports" ]; then
        echo -e "${YELLOW}💡 CONSEIL:${NC}"
        echo "   1. Connectez votre Raspberry Pi Pico via USB"
        echo "   2. Vérifiez que vous utilisez un câble USB avec données"
        echo "   3. Le Pico devrait apparaître comme /dev/ttyACM0"
        echo ""
    fi
    
    echo -e "${GREEN}✓ Vérification terminée${NC}"
    echo ""
    echo "Pour lancer RobotPi IDE:"
    echo "  • Terminal: robotpi-ide"
    echo "  • Menu: Cherchez 'RobotPi IDE' dans vos applications"
    echo ""
}

main "$@"
