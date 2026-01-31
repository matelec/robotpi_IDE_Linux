// js/ampy-manager.js - Gestionnaire des opérations ampy côté renderer

class AmpyManager {
    constructor() {
        this.currentPort = null;
        this.files = [];
    }

    /**
     * Définit le port série à utiliser
     */
    setPort(port) {
        this.currentPort = port;
        uiManager.logConsole(`Port sélectionné: ${port}`, 'info');
    }

    /**
     * Obtient le port courant
     */
    getPort() {
        return this.currentPort;
    }

    /**
     * Vérifie qu'un port est sélectionné
     */
    checkPort() {
        if (!this.currentPort) {
            throw new Error('Aucun port sélectionné');
        }
        return true;
    }

    /**
     * Liste les fichiers sur le Pico
     */
    async listFiles() {
        try {
            this.checkPort();
            uiManager.logConsole('📂 Liste des fichiers...', 'info');
            
            const result = await window.electronAPI.listFiles(this.currentPort);
            
            if (result.success) {
                this.files = result.files;
                uiManager.logConsole(`✅ ${result.files.length} fichier(s) trouvé(s)`, 'success');
                return result.files;
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            uiManager.logConsole(`❌ Erreur listage: ${error.message}`, 'error');
            throw error;
        }
    }

    /**
     * Téléverse le code Python généré
     */
    async uploadGeneratedCode(code, filename = 'main.py') {
        try {
            this.checkPort();
            uiManager.logConsole(`📤 Téléversement de ${filename}...`, 'info');
            
            const result = await window.electronAPI.uploadCode(
                this.currentPort,
                code,
                filename
            );
            
            if (result.success) {
                uiManager.logConsole(`✅ ${result.message}`, 'success');
                uiManager.showToast(`Code téléversé: ${filename}`, 'success');
                
                // Actualiser la liste des fichiers
                await this.listFiles();
                
                return true;
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            uiManager.logConsole(`❌ Erreur téléversement: ${error.message}`, 'error');
            uiManager.showToast('Erreur de téléversement', 'error');
            throw error;
        }
    }

    /**
     * Téléverse la bibliothèque robotPi.py
     */
    async uploadLibrary(code) {
        try {
            this.checkPort();
            uiManager.logConsole('📤 Téléversement de robotPi.py...', 'info');
            
            const result = await window.electronAPI.uploadCode(
                this.currentPort,
                code,
                'robotPi.py'
            );
            
            if (result.success) {
                uiManager.logConsole('✅ Bibliothèque robotPi.py téléversée', 'success');
                uiManager.showToast('Bibliothèque installée', 'success');
                
                await this.listFiles();
                return true;
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            uiManager.logConsole(`❌ Erreur: ${error.message}`, 'error');
            uiManager.showToast('Erreur installation bibliothèque', 'error');
            throw error;
        }
    }

    /**
     * Télécharge un fichier depuis le Pico
     */
    async downloadFile(remotePath) {
        try {
            this.checkPort();
            uiManager.logConsole(`📥 Téléchargement de ${remotePath}...`, 'info');
            
            const result = await window.electronAPI.downloadFile(
                this.currentPort,
                remotePath
            );
            
            if (result.success) {
                uiManager.logConsole(`✅ Fichier téléchargé: ${remotePath}`, 'success');
                return result.content;
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            uiManager.logConsole(`❌ Erreur téléchargement: ${error.message}`, 'error');
            throw error;
        }
    }

    /**
     * Supprime un fichier sur le Pico
     */
    async deleteFile(remotePath) {
        try {
            this.checkPort();
            
            if (!confirm(`Voulez-vous vraiment supprimer ${remotePath} ?`)) {
                return false;
            }
            
            uiManager.logConsole(`🗑️ Suppression de ${remotePath}...`, 'info');
            
            const result = await window.electronAPI.deleteFile(
                this.currentPort,
                remotePath
            );
            
            if (result.success) {
                uiManager.logConsole(`✅ ${result.message}`, 'success');
                uiManager.showToast('Fichier supprimé', 'success');
                
                await this.listFiles();
                return true;
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            uiManager.logConsole(`❌ Erreur suppression: ${error.message}`, 'error');
            uiManager.showToast('Erreur de suppression', 'error');
            throw error;
        }
    }

    /**
     * Crée un répertoire sur le Pico
     */
    async createDirectory(dirPath) {
        try {
            this.checkPort();
            uiManager.logConsole(`📁 Création du répertoire ${dirPath}...`, 'info');
            
            const result = await window.electronAPI.createDirectory(
                this.currentPort,
                dirPath
            );
            
            if (result.success) {
                uiManager.logConsole(`✅ ${result.message}`, 'success');
                uiManager.showToast('Répertoire créé', 'success');
                
                await this.listFiles();
                return true;
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            uiManager.logConsole(`❌ Erreur création: ${error.message}`, 'error');
            uiManager.showToast('Erreur de création', 'error');
            throw error;
        }
    }

    /**
     * Exécute une commande Python sur le Pico
     */
    async runCommand(command) {
        try {
            this.checkPort();
            uiManager.logConsole(`▶️ Exécution: ${command}`, 'info');
            
            const result = await window.electronAPI.runCommand(
                this.currentPort,
                command
            );
            
            if (result.success) {
                if (result.output) {
                    uiManager.logConsole(`Sortie: ${result.output}`, 'info');
                }
                return result.output;
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            uiManager.logConsole(`❌ Erreur exécution: ${error.message}`, 'error');
            throw error;
        }
    }

    /**
     * Réinitialise le Pico
     */
    async resetBoard() {
        try {
            this.checkPort();
            uiManager.logConsole('🔄 Réinitialisation du Pico...', 'info');
            
            const result = await window.electronAPI.resetBoard(this.currentPort);
            
            if (result.success) {
                uiManager.logConsole('✅ Pico réinitialisé', 'success');
                uiManager.showToast('Pico réinitialisé', 'success');
                return true;
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            uiManager.logConsole(`❌ Erreur reset: ${error.message}`, 'error');
            throw error;
        }
    }

    /**
     * Affiche l'explorateur de fichiers du Pico
     */
    async showFileExplorer() {
        try {
            const files = await this.listFiles();
            
            // Créer l'interface de l'explorateur
            const modal = document.getElementById('fileExplorerModal');
            const fileList = document.getElementById('picoFilesList');
            
            fileList.innerHTML = '';
            
            if (files.length === 0) {
                fileList.innerHTML = '<div class="no-files">Aucun fichier sur le Pico</div>';
            } else {
                files.forEach(file => {
                    const item = this.createFileItem(file);
                    fileList.appendChild(item);
                });
            }
            
            uiManager.toggleModal('fileExplorerModal', true);
        } catch (error) {
            uiManager.showToast('Erreur lors de la récupération des fichiers', 'error');
        }
    }

    /**
     * Crée un élément de liste pour un fichier
     */
    createFileItem(filename) {
        const item = document.createElement('div');
        item.className = 'file-item';
        
        const icon = document.createElement('span');
        icon.className = 'file-icon';
        icon.textContent = filename.endsWith('.py') ? '🐍' : '📄';
        
        const name = document.createElement('span');
        name.className = 'file-name';
        name.textContent = filename;
        
        const actions = document.createElement('div');
        actions.className = 'file-actions';
        
        // Bouton télécharger
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'btn-icon';
        downloadBtn.textContent = '⬇️';
        downloadBtn.title = 'Télécharger';
        downloadBtn.onclick = async () => {
            try {
                const content = await this.downloadFile(filename);
                const result = await window.electronAPI.saveFileDialog(content, filename);
                if (result.success) {
                    uiManager.showToast('Fichier sauvegardé', 'success');
                }
            } catch (error) {
                console.error('Erreur téléchargement:', error);
            }
        };
        
        // Bouton supprimer
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-icon btn-danger';
        deleteBtn.textContent = '🗑️';
        deleteBtn.title = 'Supprimer';
        deleteBtn.onclick = async () => {
            await this.deleteFile(filename);
            item.remove();
        };
        
        actions.appendChild(downloadBtn);
        actions.appendChild(deleteBtn);
        
        item.appendChild(icon);
        item.appendChild(name);
        item.appendChild(actions);
        
        return item;
    }
}

// Instance globale
const ampyManager = new AmpyManager();