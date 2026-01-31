/**
 * Configuration globale de l'application Desktop
 */

const CONFIG = {
    // Configuration par défaut du robot
    pins: {
        pwmG: 0,
        in1G: 1,
        in2G: 2,
        pwmD: 3,
        in1D: 4,
        in2D: 5,
        stby: 6
    },
    
    // Paramètres série
    serial: {
        baudRate: 115200,
        timeout: 1000
    },
    
    // Limites
    limits: {
        maxProgramSize: 100 * 1024, // 100 KB
        maxBlocks: 1000
    },
    
    // Messages
    messages: {
        success: {
            connected: '✅ Connecté au Pico',
            disconnected: '🔌 Déconnecté',
            uploaded: '✅ Code téléversé avec succès',
            saved: '💾 Programme sauvegardé',
            loaded: '📂 Programme chargé',
            generated: '⚡ Code Python généré',
            libraryInstalled: '📚 Bibliothèque robotPi.py installée'
        },
        error: {
            connection: '❌ Erreur de connexion',
            upload: '❌ Erreur de téléversement',
            save: '❌ Erreur de sauvegarde',
            load: '❌ Erreur de chargement',
            noPort: '❌ Aucun port sélectionné',
            noBlocks: '⚠️ Aucun bloc dans le programme',
            ampyNotFound: '❌ ampy non trouvé. Installez-le avec: pip install adafruit-ampy'
        },
        warning: {
            emptyProgram: '⚠️ Le programme est vide',
            notConnected: '⚠️ Pico non connecté'
        }
    },
    
    // Mode application
    isElectron: typeof window !== 'undefined' && typeof window.electronAPI !== 'undefined'
};

// Charger la configuration sauvegardée
function loadConfig() {
    const saved = localStorage.getItem('robotpi_config');
    if (saved) {
        try {
            const config = JSON.parse(saved);
            Object.assign(CONFIG.pins, config);
        } catch (e) {
            console.error('Erreur chargement config:', e);
        }
    }
}

// Sauvegarder la configuration
function saveConfig() {
    localStorage.setItem('robotpi_config', JSON.stringify(CONFIG.pins));
}

// Initialiser au chargement
if (typeof window !== 'undefined') {
    loadConfig();
}