// preload.js - Script de préchargement (pont entre main et renderer)
const { contextBridge, ipcRenderer } = require('electron');

// Exposer l'API Electron au renderer de manière sécurisée
contextBridge.exposeInMainWorld('electronAPI', {
    // Ports série
    listPorts: () => ipcRenderer.invoke('list-ports'),
    
    // Opérations ampy
    uploadFile: (port, localPath, remotePath) => 
        ipcRenderer.invoke('upload-file', { port, localPath, remotePath }),
    
    uploadCode: (port, code, filename) => 
        ipcRenderer.invoke('upload-code', { port, code, filename }),
    
    listFiles: (port) => 
        ipcRenderer.invoke('list-files', { port }),
    
    downloadFile: (port, remotePath) => 
        ipcRenderer.invoke('download-file', { port, remotePath }),
    
    deleteFile: (port, remotePath) => 
        ipcRenderer.invoke('delete-file', { port, remotePath }),
    
    createDirectory: (port, dirPath) => 
        ipcRenderer.invoke('create-directory', { port, dirPath }),
    
    runCommand: (port, command) => 
        ipcRenderer.invoke('run-command', { port, command }),
    
    resetBoard: (port) => 
        ipcRenderer.invoke('reset-board', { port }),

    // Vérifier ampy
    checkAmpy: () => 
        ipcRenderer.invoke('check-ampy'),

    // ⭐ NOUVEAU : Obtenir le chemin des ressources
    getResourcePath: (relativePath) => 
        ipcRenderer.invoke('get-resource-path', relativePath),

    // Moniteur série
    startSerialMonitor: (port) => 
        ipcRenderer.invoke('start-serial-monitor', port),
    
    stopSerialMonitor: () => 
        ipcRenderer.invoke('stop-serial-monitor'),
    
    onSerialData: (callback) => 
        ipcRenderer.on('serial-data', (event, data) => callback(data)),
    
    sendCommand: (port, command) => 
        ipcRenderer.invoke('send-command', port, command),
    
    // Dialogues fichiers
    openFileDialog: () => 
        ipcRenderer.invoke('open-file-dialog'),
    
    saveFileDialog: (content, defaultName) => 
        ipcRenderer.invoke('save-file-dialog', { content, defaultName }),
    
    saveProject: (project, defaultName) => 
        ipcRenderer.invoke('save-project', { project, defaultName }),
    
    loadProject: () => 
        ipcRenderer.invoke('load-project'),
    
    // Informations système
    getAppInfo: () => 
        ipcRenderer.invoke('get-app-info')
});