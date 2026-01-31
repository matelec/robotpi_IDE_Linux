// main.js - Processus principal Electron avec moniteur série

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

let mainWindow;
let serialPorts = [];
let ampyPath = null;
let serialMonitor = null;
let serialParser = null;

// Créer la fenêtre principale
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, 'assets', 'icon.png'),
        title: 'RobotPi Desktop IDE'
    });

    mainWindow.loadFile(path.join(__dirname, '..', 'app', 'index.html'));

    // Ouvrir DevTools en développement
    if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
    }
}

app.whenReady().then(() => {
    detectAmpyPath();
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Fermer le moniteur à la fermeture de l'app
app.on('before-quit', () => {
    if (serialMonitor && serialMonitor.isOpen) {
        serialMonitor.close();
    }
});

// ==========================================
// Détection d'ampy
// ==========================================

function detectAmpyPath() {
    console.log('🔍 Recherche d\'ampy...');
    
    const possiblePaths = [
        'ampy',
        '/usr/local/bin/ampy',
        '/usr/bin/ampy',
        '/opt/homebrew/bin/ampy',
        path.join(process.env.HOME, '.local', 'bin', 'ampy'),
        path.join(process.env.HOME, 'Library', 'Python', '3.11', 'bin', 'ampy'),
        path.join(process.env.HOME, 'Library', 'Python', '3.10', 'bin', 'ampy'),
        path.join(process.env.HOME, 'Library', 'Python', '3.9', 'bin', 'ampy'),
    ];
    
    try {
        const whichResult = execSync('which ampy', { encoding: 'utf8' }).trim();
        if (whichResult && fs.existsSync(whichResult)) {
            ampyPath = whichResult;
            console.log('✅ ampy trouvé:', ampyPath);
            return;
        }
    } catch (e) {
        // which a échoué
    }
    
    for (const testPath of possiblePaths) {
        try {
            const fullPath = testPath.startsWith('/') ? testPath : testPath;
            
            if (fs.existsSync(fullPath)) {
                fs.accessSync(fullPath, fs.constants.X_OK);
                ampyPath = fullPath;
                console.log('✅ ampy trouvé:', ampyPath);
                return;
            }
        } catch (e) {
            // Continue
        }
    }
    
    try {
        execSync('python3 -m ampy --help', { stdio: 'ignore' });
        ampyPath = 'python3 -m ampy';
        console.log('✅ ampy trouvé via python3 -m ampy');
        return;
    } catch (e) {
        // Pas disponible
    }
    
    console.warn('⚠️ ampy non trouvé');
    console.log('💡 Installez ampy avec: pip3 install adafruit-ampy');
}

// ==========================================
// Moniteur série
// ==========================================

ipcMain.handle('start-serial-monitor', async (event, port) => {
    try {
        // Fermer le moniteur existant
        if (serialMonitor && serialMonitor.isOpen) {
            await new Promise((resolve) => {
                serialMonitor.close(() => resolve());
            });
        }
        
        // Créer une nouvelle connexion
        serialMonitor = new SerialPort({
            path: port,
            baudRate: 115200,
            autoOpen: false
        });
        
        // Parser pour lire ligne par ligne
        serialParser = serialMonitor.pipe(new ReadlineParser({ delimiter: '\n' }));
        
        // Ouvrir le port
        await new Promise((resolve, reject) => {
            serialMonitor.open((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        
        // Écouter les données
        serialParser.on('data', (data) => {
            // Nettoyer et envoyer au renderer
            const cleanData = data.replace(/\r/g, '').trim();
            if (cleanData) {
                event.sender.send('serial-data', cleanData);
            }
        });
        
        serialMonitor.on('error', (err) => {
            console.error('Erreur série:', err);
            event.sender.send('serial-data', `[ERREUR] ${err.message}`);
        });
        
        console.log('✅ Moniteur série démarré sur', port);
        return true;
    } catch (error) {
        console.error('Erreur démarrage moniteur:', error);
        return false;
    }
});

ipcMain.handle('stop-serial-monitor', async () => {
    return new Promise((resolve) => {
        if (serialMonitor && serialMonitor.isOpen) {
            serialMonitor.close(() => {
                serialMonitor = null;
                serialParser = null;
                console.log('✅ Moniteur série arrêté');
                resolve(true);
            });
        } else {
            resolve(true);
        }
    });
});

// Envoyer une commande sur le port série
ipcMain.handle('send-command', async (event, port, command) => {
    return new Promise((resolve, reject) => {
        const tempPort = new SerialPort({ 
            path: port, 
            baudRate: 115200 
        });
        
        tempPort.on('open', () => {
            tempPort.write(command, (err) => {
                if (err) {
                    tempPort.close();
                    reject(err);
                } else {
                    setTimeout(() => {
                        tempPort.close();
                        resolve(true);
                    }, 500);
                }
            });
        });
        
        tempPort.on('error', (err) => {
            reject(err);
        });
    });
});

// ==========================================
// Gestion des ports série
// ==========================================

ipcMain.handle('list-ports', async () => {
    try {
        const ports = await SerialPort.list();
        
        serialPorts = ports.map(port => ({
            path: port.path,
            manufacturer: port.manufacturer || 'Inconnu',
            serialNumber: port.serialNumber || '',
            productId: port.productId || '',
            vendorId: port.vendorId || '',
            isPico: (port.manufacturer && port.manufacturer.includes('MicroPython')) ||
                    (port.manufacturer && port.manufacturer.includes('Raspberry Pi')) ||
                    port.path.includes('usbmodem')
        }));
        
        return { success: true, ports: serialPorts };
    } catch (error) {
        console.error('Erreur listage ports:', error);
        return { success: false, error: error.message };
    }
});

// ==========================================
// Gestion d'ampy
// ==========================================

function executeAmpy(port, args) {
    return new Promise((resolve, reject) => {
        if (!ampyPath) {
            reject({ 
                success: false, 
                error: 'ampy non trouvé. Installez-le avec: pip3 install adafruit-ampy' 
            });
            return;
        }
        
        let command, commandArgs;
        
        if (ampyPath.includes('python3 -m ampy')) {
            command = 'python3';
            commandArgs = ['-m', 'ampy', '--port', port, '--baud', '115200', ...args];
        } else {
            command = ampyPath;
            commandArgs = ['--port', port, '--baud', '115200', ...args];
        }
        
        console.log(`Exécution: ${command} ${commandArgs.join(' ')}`);
        
        const ampy = spawn(command, commandArgs);
        
        let stdout = '';
        let stderr = '';
        
        ampy.stdout.on('data', (data) => {
            stdout += data.toString();
        });
        
        ampy.stderr.on('data', (data) => {
            stderr += data.toString();
        });
        
        ampy.on('close', (code) => {
            if (code === 0) {
                resolve({ success: true, output: stdout });
            } else {
                reject({ success: false, error: stderr || stdout });
            }
        });
        
        ampy.on('error', (error) => {
            reject({ success: false, error: error.message });
        });
    });
}

ipcMain.handle('upload-file', async (event, { port, localPath, remotePath }) => {
    try {
        const absolutePath = path.join(app.getAppPath(), localPath);
        
        console.log('Chemin absolu:', absolutePath);
        
        if (!fs.existsSync(absolutePath)) {
            throw new Error(`Fichier non trouvé: ${absolutePath}`);
        }
        
        const { execSync } = require('child_process');
        const command = `ampy --port ${port} put "${absolutePath}" ${remotePath}`;
        
        execSync(command, { encoding: 'utf8' });
        
        return { success: true };
    } catch (error) {
        console.error('Erreur upload-file:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('upload-code', async (event, { port, code, filename = 'main.py' }) => {
    try {
        const tempDir = app.getPath('temp');
        const tempFile = path.join(tempDir, `robotpi_${Date.now()}.py`);
        
        fs.writeFileSync(tempFile, code, 'utf8');
        
        const result = await executeAmpy(port, ['put', tempFile, filename]);
        
        fs.unlinkSync(tempFile);
        
        return { success: true, message: `Code téléversé: ${filename}` };
    } catch (error) {
        console.error('Erreur téléversement code:', error);
        return { success: false, error: error.error || error.message };
    }
});

ipcMain.handle('list-files', async (event, { port }) => {
    try {
        const result = await executeAmpy(port, ['ls']);
        
        const files = result.output
            .split('\n')
            .filter(line => line.trim())
            .map(line => line.trim());
        
        return { success: true, files };
    } catch (error) {
        console.error('Erreur listage fichiers:', error);
        return { success: false, error: error.error || error.message };
    }
});

ipcMain.handle('download-file', async (event, { port, remotePath }) => {
    try {
        const result = await executeAmpy(port, ['get', remotePath]);
        return { success: true, content: result.output };
    } catch (error) {
        console.error('Erreur téléchargement:', error);
        return { success: false, error: error.error || error.message };
    }
});

ipcMain.handle('delete-file', async (event, { port, remotePath }) => {
    try {
        await executeAmpy(port, ['rm', remotePath]);
        return { success: true, message: `Fichier supprimé: ${remotePath}` };
    } catch (error) {
        console.error('Erreur suppression:', error);
        return { success: false, error: error.error || error.message };
    }
});

ipcMain.handle('create-directory', async (event, { port, dirPath }) => {
    try {
        await executeAmpy(port, ['mkdir', dirPath]);
        return { success: true, message: `Répertoire créé: ${dirPath}` };
    } catch (error) {
        console.error('Erreur création répertoire:', error);
        return { success: false, error: error.error || error.message };
    }
});

ipcMain.handle('run-command', async (event, { port, command }) => {
    try {
        const result = await executeAmpy(port, ['run', '-n', '--', command]);
        return { success: true, output: result.output };
    } catch (error) {
        console.error('Erreur exécution:', error);
        return { success: false, error: error.error || error.message };
    }
});

ipcMain.handle('reset-board', async (event, { port }) => {
    try {
        await executeAmpy(port, ['reset']);
        return { success: true, message: 'Carte réinitialisée' };
    } catch (error) {
        console.error('Erreur reset:', error);
        return { success: false, error: error.error || error.message };
    }
});

ipcMain.handle('check-ampy', async () => {
    return {
        success: ampyPath !== null,
        path: ampyPath,
        message: ampyPath ? `ampy trouvé: ${ampyPath}` : 'ampy non trouvé'
    };
});

// ==========================================
// Gestion des fichiers locaux
// ==========================================

ipcMain.handle('open-file-dialog', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [
            { name: 'Python', extensions: ['py'] },
            { name: 'Tous les fichiers', extensions: ['*'] }
        ]
    });
    
    if (!result.canceled && result.filePaths.length > 0) {
        const filePath = result.filePaths[0];
        const content = fs.readFileSync(filePath, 'utf8');
        return { 
            success: true, 
            path: filePath, 
            name: path.basename(filePath),
            content 
        };
    }
    
    return { success: false };
});

ipcMain.handle('save-file-dialog', async (event, { content, defaultName = 'programme.py' }) => {
    const result = await dialog.showSaveDialog(mainWindow, {
        defaultPath: defaultName,
        filters: [
            { name: 'Python', extensions: ['py'] },
            { name: 'Tous les fichiers', extensions: ['*'] }
        ]
    });
    
    if (!result.canceled && result.filePath) {
        fs.writeFileSync(result.filePath, content, 'utf8');
        return { success: true, path: result.filePath };
    }
    
    return { success: false };
});

ipcMain.handle('save-project', async (event, { project, defaultName = 'projet.json' }) => {
    const result = await dialog.showSaveDialog(mainWindow, {
        defaultPath: defaultName,
        filters: [
            { name: 'Projet RobotPi', extensions: ['json'] },
            { name: 'Tous les fichiers', extensions: ['*'] }
        ]
    });
    
    if (!result.canceled && result.filePath) {
        fs.writeFileSync(result.filePath, JSON.stringify(project, null, 2), 'utf8');
        return { success: true, path: result.filePath };
    }
    
    return { success: false };
});

ipcMain.handle('load-project', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [
            { name: 'Projet RobotPi', extensions: ['json'] },
            { name: 'Tous les fichiers', extensions: ['*'] }
        ]
    });
    
    if (!result.canceled && result.filePaths.length > 0) {
        const filePath = result.filePaths[0];
        const content = fs.readFileSync(filePath, 'utf8');
        const project = JSON.parse(content);
        return { success: true, project, path: filePath };
    }
    
    return { success: false };
});

// ==========================================
// Informations système
// ==========================================

ipcMain.handle('get-app-info', async () => {
    return {
        version: app.getVersion(),
        platform: process.platform,
        arch: process.arch,
        electronVersion: process.versions.electron,
        nodeVersion: process.versions.node,
        ampyPath: ampyPath,
        ampyAvailable: ampyPath !== null
    };
});