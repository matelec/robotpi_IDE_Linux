let workspace;
const appState = {
    isElectron: typeof window.electronAPI !== 'undefined',
    currentPort: null
};

// État du moniteur série
const serialMonitor = {
    isRunning: false,
    port: null
};

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 RobotPi IDE démarré');

    initBlockly();
    initEventListeners();

    if (appState.isElectron) {
        logConsole('✅ Mode Electron détecté', 'success');
        const appInfo = await window.electronAPI.getAppInfo();
        logConsole(`Version ${appInfo.version}`, 'info');
        await checkAmpyStatus();
        await refreshPorts();
        
        // Écouter les données du moniteur série
        window.electronAPI.onSerialData((data) => {
            logConsole('🤖 ' + data, 'output');
        });
    } else {
        logConsole('⚠️ Mode navigateur (fonctionnalités limitées)', 'warning');
    }

    console.log('🤖 RobotPi IDE prêt');
});

/**
 * Initialise Blockly
 */
function initBlockly() {
    workspace = Blockly.inject('blocklyDiv', {
        toolbox: toolbox,
        scrollbars: true,
        trashcan: true,
        zoom: {
            controls: true,
            wheel: true,
            startScale: 1.0,
            maxScale: 3,
            minScale: 0.3,
            scaleSpeed: 1.2
        },
        grid: {
            spacing: 20,
            length: 3,
            colour: '#3e3e42',
            snap: true
        },
        theme: Blockly.Theme.defineTheme('robotpi_dark', {
            'base': Blockly.Themes.Classic,
            'componentStyles': {
                'workspaceBackgroundColour': '#1e1e1e',
                'toolboxBackgroundColour': '#252526',
                'toolboxForegroundColour': '#d4d4d4',
                'flyoutBackgroundColour': '#2d2d30',
                'flyoutForegroundColour': '#d4d4d4',
                'flyoutOpacity': 1,
                'scrollbarColour': '#3e3e42',
                'insertionMarkerColour': '#ffffff',
                'insertionMarkerOpacity': 0.3,
                'scrollbarOpacity': 0.4,
                'cursorColour': '#d4d4d4'
            }
        })
    });

    workspace.addChangeListener(onWorkspaceChange);
    console.log('✅ Blockly initialisé');
}

/**
 * Gestion des changements dans Blockly
 */
function onWorkspaceChange(event) {
    const blockCount = workspace.getAllBlocks(false).length;
    updateBlockCount(blockCount);
}

/**
 * Génère le code Python depuis Blockly
 */
function generatePythonCode() {
    try {
        const code = Blockly.Python.workspaceToCode(workspace);
        document.getElementById('pythonCode').value = code;
        logConsole('✅ Code Python généré', 'success');

        if (appState.currentPort) {
            document.getElementById('uploadBtn').disabled = false;
        }
    } catch (error) {
        logConsole('❌ Erreur de génération: ' + error.message, 'error');
    }
}

/**
 * Initialise les événements
 */
function initEventListeners() {
    document.getElementById('generateBtn').addEventListener('click', generatePythonCode);
    document.getElementById('uploadBtn').addEventListener('click', uploadCode);
    document.getElementById('clearBtn').addEventListener('click', clearWorkspace);
    document.getElementById('saveBtn').addEventListener('click', saveWorkspace);
    document.getElementById('loadBtn').addEventListener('click', loadWorkspace);
    document.getElementById('refreshPortsBtn').addEventListener('click', refreshPorts);
    document.getElementById('portSelect').addEventListener('change', handlePortSelect);
    document.getElementById('clearConsoleBtn').addEventListener('click', clearConsole);
    document.getElementById('copyCodeBtn').addEventListener('click', copyCode);
    document.getElementById('downloadCodeBtn').addEventListener('click', downloadCode);
    document.getElementById('filesBtn').addEventListener('click', showFileManager);
    document.getElementById('installLibBtn').addEventListener('click', installLibrary);
    document.getElementById('configBtn')?.addEventListener('click', openConfigModal);
    
    // Moniteur série
    const monitorBtn = document.getElementById('monitorBtn');
    if (monitorBtn) {
        monitorBtn.addEventListener('click', toggleSerialMonitor);
    }
    
    // Bouton reset
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', handleReset);
    }
}

// ==========================================
// Moniteur série
// ==========================================

/**
 * Démarre le moniteur série
 */
async function startSerialMonitor() {
    if (!appState.currentPort) {
        showToast('Sélectionnez un port série', 'warning');
        return;
    }
    
    if (serialMonitor.isRunning) {
        showToast('Moniteur déjà démarré', 'info');
        return;
    }
    
    try {
        const success = await window.electronAPI.startSerialMonitor(appState.currentPort);
        
        if (success) {
            serialMonitor.isRunning = true;
            serialMonitor.port = appState.currentPort;
            logConsole('📡 Moniteur série démarré', 'success');
            updateMonitorButton();
        }
    } catch (error) {
        logConsole('❌ Erreur moniteur: ' + error.message, 'error');
        throw error;
    }
}

/**
 * Arrête le moniteur série
 */
async function stopSerialMonitor() {
    if (!serialMonitor.isRunning) {
        return;
    }
    
    try {
        await window.electronAPI.stopSerialMonitor();
        serialMonitor.isRunning = false;
        serialMonitor.port = null;
        logConsole('📡 Moniteur série arrêté', 'info');
        updateMonitorButton();
    } catch (error) {
        logConsole('❌ Erreur arrêt moniteur: ' + error.message, 'error');
        throw error;
    }
}

/**
 * Toggle du moniteur série
 */
function toggleSerialMonitor() {
    if (serialMonitor.isRunning) {
        stopSerialMonitor();
    } else {
        startSerialMonitor();
    }
}

/**
 * Met à jour le bouton du moniteur
 */
function updateMonitorButton() {
    const btn = document.getElementById('monitorBtn');
    if (btn) {
        if (serialMonitor.isRunning) {
            btn.textContent = '⏹️ Arrêter moniteur';
            btn.classList.add('active');
        } else {
            btn.textContent = '📡 Moniteur série';
            btn.classList.remove('active');
        }
    }
}

/**
 * Reset Pico Pi W
 */
async function resetBoard(port) {
    try {
        logConsole('🔄 Reset Pico Pi W...', 'info');
        
        // Ctrl+C puis Ctrl+D pour soft reboot
        await window.electronAPI.sendCommand(port, '\x03\x04');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // machine.reset()
        //await window.electronAPI.sendCommand(port, 'import machine\r\n');
        //await new Promise(resolve => setTimeout(resolve, 100));
        //await window.electronAPI.sendCommand(port, 'machine.reset()\r\n');
        
        logConsole('✅ Pico Pi W redémarré', 'success');
        return true;
    } catch (error) {
        logConsole('⚠️ Erreur lors du reset: ' + error.message, 'warning');
        return false;
    }
}

/**
 * Gestion du bouton reset
 */
async function handleReset() {
    if (!appState.currentPort) {
        showToast('Sélectionnez un port série', 'warning');
        return;
    }
    
    const wasRunning = serialMonitor.isRunning;
    
    try {
        // Arrêter le moniteur temporairement
        if (wasRunning) {
            await stopSerialMonitor();
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Reset
        await resetBoard(appState.currentPort);
        
        // Attendre le redémarrage
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Redémarrer le moniteur si il était actif
        if (wasRunning) {
            try {
                await startSerialMonitor();
            } catch (monitorError) {
                logConsole('⚠️ Impossible de redémarrer le moniteur', 'warning');
            }
        }

        showToast('Pico Pi W redémarré', 'success');
    } catch (error) {
        showToast('Erreur de reset', 'error');
        
        // Tenter de restaurer le moniteur
        if (wasRunning) {
            try {
                await startSerialMonitor();
            } catch (restoreError) {
                logConsole('⚠️ Moniteur non restauré', 'warning');
            }
        }
    }
}

/**
 * Téléverse le code sur le Pico Pi W
 */
async function uploadCode() {
    if (!appState.isElectron) {
        showToast('Fonctionnalité Desktop uniquement', 'warning');
        return;
    }
    
    if (!appState.currentPort) {
        showToast('Sélectionnez un port série', 'warning');
        return;
    }
    
    const code = document.getElementById('pythonCode').value;
    if (!code || code.trim().length === 0) {
        showToast('Générez d\'abord le code', 'warning');
        return;
    }
    
    const uploadBtn = document.getElementById('uploadBtn');
    const wasMonitorRunning = serialMonitor.isRunning;
    
    try {
        uploadBtn.disabled = true;
        
        // Arrêter le moniteur si actif
        if (wasMonitorRunning) {
            logConsole('⏸️ Arrêt temporaire du moniteur...', 'info');
            await stopSerialMonitor();
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        logConsole('📤 Téléversement en cours...', 'info');
        
        const result = await window.electronAPI.uploadCode(
            appState.currentPort,
            code,
            'main.py'
        );
        
        if (!result.success) {
            throw new Error(result.error || 'Échec du téléversement');
        }
        
        logConsole('✅ Code téléversé avec succès', 'success');
        showToast('Code téléversé !', 'success');
        
        // Attendre que le programme se lance automatiquement
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Démarrer le moniteur pour voir l'exécution
        try {
            logConsole('📡 Démarrage du moniteur...', 'info');
            await startSerialMonitor();
            showToast('Programme lancé ! Utilisez le bouton reset pour redémarrer', 'info');
        } catch (monitorError) {
            logConsole('⚠️ Erreur au démarrage du moniteur: ' + monitorError.message, 'warning');
            showToast('Code uploadé mais moniteur non démarré', 'warning');
        }
        
    } catch (error) {
        logConsole('❌ Erreur: ' + error.message, 'error');
        showToast('Erreur de téléversement', 'error');
        
        // Tenter de restaurer le moniteur en cas d'erreur
        if (wasMonitorRunning) {
            try {
                await new Promise(resolve => setTimeout(resolve, 500));
                logConsole('🔄 Tentative de redémarrage du moniteur...', 'info');
                await startSerialMonitor();
            } catch (restoreError) {
                logConsole('⚠️ Impossible de redémarrer le moniteur', 'warning');
            }
        }
    } finally {
        uploadBtn.disabled = false;
    }
}

// ==========================================
// Workspace et fichiers
// ==========================================

/**
 * Sauvegarde le workspace
 */
async function saveWorkspace() {
    const state = Blockly.serialization.workspaces.save(workspace);
    
    const project = {
        version: '1.0',
        type: 'blockly',
        name: 'Programme RobotPi',
        created: new Date().toISOString(),
        workspace: state
    };
    
    if (appState.isElectron) {
        try {
            const result = await window.electronAPI.saveProject(
                project,
                'mon_programme_blockly.json'
            );
            if (result.success) {
                logConsole('💾 Projet sauvegardé', 'success');
                showToast('Projet sauvegardé', 'success');
            }
        } catch (error) {
            logConsole('❌ Erreur: ' + error.message, 'error');
            showToast('Erreur de sauvegarde', 'error');
        }
    } else {
        const blob = new Blob([JSON.stringify(project, null, 2)], 
            { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'programme_blockly.json';
        a.click();
        URL.revokeObjectURL(url);
        showToast('Projet téléchargé', 'success');
    }
}

/**
 * Charge un workspace
 */
async function loadWorkspace() {
    if (appState.isElectron) {
        try {
            const result = await window.electronAPI.loadProject();
            if (result.success && result.project.workspace) {
                loadWorkspaceFromState(result.project.workspace);
                logConsole('📂 Projet chargé', 'success');
                showToast('Projet chargé', 'success');
            }
        } catch (error) {
            logConsole('❌ Erreur: ' + error.message, 'error');
            showToast('Erreur de chargement', 'error');
        }
    } else {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const project = JSON.parse(event.target.result);
                        if (project.workspace) {
                            loadWorkspaceFromState(project.workspace);
                            showToast('Projet chargé', 'success');
                        }
                    } catch (error) {
                        showToast('Fichier invalide', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }
}

/**
 * Charge le workspace depuis l'état sauvegardé
 */
function loadWorkspaceFromState(state) {
    workspace.clear();
    Blockly.serialization.workspaces.load(state, workspace);
}

/**
 * Copie le code Python
 */
function copyCode() {
    const code = document.getElementById('pythonCode').value;
    navigator.clipboard.writeText(code).then(() => {
        showToast('Code copié !', 'success');
    }).catch(() => {
        showToast('Erreur de copie', 'error');
    });
}

/**
 * Télécharge le code Python
 */
function downloadCode() {
    const code = document.getElementById('pythonCode').value;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'main.py';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Fichier téléchargé !', 'success');
}

/**
 * Rafraîchit les ports série
 */
async function refreshPorts() {
    if (!appState.isElectron) return;
    
    const refreshBtn = document.getElementById('refreshPortsBtn');
    const select = document.getElementById('portSelect');
    const wasMonitorRunning = serialMonitor.isRunning;
    const previousPort = appState.currentPort;
    
    try {
        // Désactiver le bouton et le select pendant le refresh
        if (refreshBtn) refreshBtn.disabled = true;
        select.innerHTML = '<option value="">🔄 Recherche en cours...</option>';
        select.disabled = true;
        
        // Arrêter temporairement le moniteur s'il est actif
        if (wasMonitorRunning) {
            logConsole('⏸️ Arrêt temporaire du moniteur pour scan...', 'info');
            await stopSerialMonitor();
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        logConsole('🔍 Recherche des ports...', 'info');
        const result = await window.electronAPI.listPorts();
        
        if (result.success) {
            select.innerHTML = '<option value="">Sélectionner un port...</option>';
            
            let portFound = false;
            result.ports.forEach(port => {
                const option = document.createElement('option');
                option.value = port.path;
                option.textContent = `${port.path}${port.isPico ? ' 🎯' : ''}`;
                
                // Resélectionner le port précédent s'il existe toujours
                if (port.path === previousPort) {
                    option.selected = true;
                    portFound = true;
                }
                
                select.appendChild(option);
            });
            
            // Si le port précédent n'existe plus, réinitialiser
            if (!portFound && previousPort) {
                appState.currentPort = null;
                document.getElementById('portInfo').innerHTML = `
                    <span>🔌</span>
                    <span>Aucun port</span>
                `;
                logConsole('⚠️ Port précédent déconnecté', 'warning');
            }
            
            const portCount = result.ports.length;
            logConsole(`✅ ${portCount} port(s) détecté(s)`, 'success');
            
            if (portCount === 0) {
                showToast('Aucun port détecté - Vérifiez la connexion', 'warning');
            }
            
        } else {
            throw new Error(result.error || 'Échec de la détection des ports');
        }
        
    } catch (error) {
        logConsole('❌ Erreur: ' + error.message, 'error');
        showToast('Erreur de détection des ports', 'error');
        select.innerHTML = '<option value="">Erreur de détection</option>';
    } finally {
        // Réactiver le bouton et le select
        if (refreshBtn) refreshBtn.disabled = false;
        select.disabled = false;
        
        // Redémarrer le moniteur s'il était actif et qu'un port est sélectionné
        if (wasMonitorRunning && appState.currentPort) {
            try {
                await new Promise(resolve => setTimeout(resolve, 500));
                logConsole('🔄 Redémarrage du moniteur...', 'info');
                await startSerialMonitor();
            } catch (monitorError) {
                logConsole('⚠️ Impossible de redémarrer le moniteur: ' + monitorError.message, 'warning');
                showToast('Moniteur non redémarré - Relancez-le manuellement', 'warning');
            }
        }
    }
}

/**
 * Gestion de la sélection du port
 */
function handlePortSelect(e) {
    appState.currentPort = e.target.value;
    if (appState.currentPort) {
        document.getElementById('portInfo').innerHTML = `
            <span>🔌</span>
            <span>${appState.currentPort}</span>
        `;
        logConsole(`Port sélectionné: ${appState.currentPort}`, 'info');
    }
}

/**
 * Vérifie ampy
 */
async function checkAmpyStatus() {
    if (!appState.isElectron) return;
    
    try {
        const result = await window.electronAPI.checkAmpy();
        if (result.success) {
            logConsole(`✅ ${result.message}`, 'success');
        } else {
            logConsole('⚠️ ampy non détecté', 'warning');
            setTimeout(() => {
                showToast('ampy non trouvé - Installez-le avec: pip3 install adafruit-ampy', 'warning');
            }, 1000);
        }
    } catch (error) {
        console.error('Erreur vérification ampy:', error);
    }
}

/**
 * Efface le workspace
 */
function clearWorkspace() {
    if (workspace.getAllBlocks(false).length > 0 && 
        !confirm('Voulez-vous vraiment effacer tous les blocs ?')) {
        return;
    }
    workspace.clear();
    logConsole('Programme effacé', 'info');
    showToast('Programme effacé', 'info');
}

/**
 * Affiche le gestionnaire de fichiers
 */
async function showFileManager() {
    if (!appState.isElectron) {
        showToast('Fonctionnalité Desktop uniquement', 'warning');
        return;
    }
    
    if (!appState.currentPort) {
        showToast('Sélectionnez d\'abord un port série', 'warning');
        return;
    }
    
    try {
        const modal = document.getElementById('fileExplorerModal');
        const fileList = document.getElementById('picoFilesList');
        
        modal.classList.add('active');
        fileList.innerHTML = '<div class="loading">Chargement...</div>';
        
        const result = await window.electronAPI.listFiles(appState.currentPort);
        
        if (result.success && result.files.length > 0) {
            fileList.innerHTML = '';
            result.files.forEach(file => {
                const item = document.createElement('div');
                item.className = 'file-item';
                item.innerHTML = `
                    <span class="file-icon">${file.endsWith('.py') ? '🐍' : '📄'}</span>
                    <span class="file-name">${file}</span>
                    <div class="file-actions">
                        <button class="btn-icon" onclick="downloadFile('${file}')" title="Télécharger">⬇️</button>
                        <button class="btn-icon btn-danger" onclick="deleteFile('${file}')" title="Supprimer">🗑️</button>
                    </div>
                `;
                fileList.appendChild(item);
            });
        } else {
            fileList.innerHTML = '<div class="loading">Aucun fichier sur le Pico</div>';
        }
    } catch (error) {
        logConsole('❌ Erreur: ' + error.message, 'error');
        showToast('Erreur d\'accès aux fichiers', 'error');
    }
}

/**
 * Télécharge un fichier du Pico
 */
async function downloadFile(filename) {
    try {
        const result = await window.electronAPI.downloadFile(appState.currentPort, filename);
        if (result.success) {
            const saveResult = await window.electronAPI.saveFileDialog(result.content, filename);
            if (saveResult.success) {
                showToast('Fichier sauvegardé', 'success');
            }
        }
    } catch (error) {
        showToast('Erreur de téléchargement', 'error');
    }
}

/**
 * Supprime un fichier du Pico
 */
async function deleteFile(filename) {
    if (!confirm(`Supprimer ${filename} ?`)) return;
    
    try {
        const result = await window.electronAPI.deleteFile(appState.currentPort, filename);
        if (result.success) {
            showToast('Fichier supprimé', 'success');
            showFileManager();
        }
    } catch (error) {
        showToast('Erreur de suppression', 'error');
    }
}

/**
 * Installe la bibliothèque robotPi.py
 */
async function installLibrary() {
    if (!appState.isElectron) {
        showToast('Fonctionnalité Desktop uniquement', 'warning');
        return;
    }
    
    if (!appState.currentPort) {
        showToast('Sélectionnez d\'abord un port série', 'warning');
        return;
    }
    
    try {
        logConsole('📚 Installation de robotPi.py...', 'info');
        
        const localPath = 'micropython/robotPi.py';
        const remotePath = 'robotPi.py';
        
        const result = await window.electronAPI.uploadFile(
            appState.currentPort,
            localPath,
            remotePath
        );
        
        if (result.success) {
            logConsole('✅ Bibliothèque installée', 'success');
            showToast('Bibliothèque robotPi.py installée !', 'success');
        } else {
            throw new Error(result.error || 'Erreur lors du téléversement');
        }
    } catch (error) {
        logConsole('❌ Erreur: ' + error.message, 'error');
        showToast('Erreur d\'installation', 'error');
    }
}

/**
 * Ferme un modal
 */
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// ==========================================
// Utilitaires UI
// ==========================================

function logConsole(message, type = 'info') {
    const console = document.getElementById('console');
    const line = document.createElement('div');
    line.className = `console-line ${type}`;
    
    const time = new Date().toTimeString().split(' ')[0];
    line.innerHTML = `
        <span class="console-time">[${time}]</span>
        <span class="console-text">${message}</span>
    `;
    
    console.appendChild(line);
    console.scrollTop = console.scrollHeight;
}

function clearConsole() {
    document.getElementById('console').innerHTML = '';
    logConsole('Console effacée', 'info');
}

function updateBlockCount(count) {
    document.getElementById('blockCount').innerHTML = `
        <span>📦</span>
        <span>${count} bloc${count > 1 ? 's' : ''}</span>
    `;
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    const colors = {
        success: '#0e7a0d',
        error: '#f14c4c',
        warning: '#f4b41a',
        info: '#0e639c',
        output: '#569cd6'
    };
    
    toast.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}