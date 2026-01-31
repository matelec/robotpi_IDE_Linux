// fichiers Blockly pour les blocs RobotPi bouton personnalisé
console.log('✅ Début du chargement de robotpi_bouton.js');

Blockly.Blocks['robotpi_demarrer_au_bouton'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('⏯️ Démarrer au bouton');
        
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#1976D2');
        this.setTooltip('Attend que le bouton soit appuyé pour démarrer le programme');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['robotpi_arreter_au_bouton'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('⏯️ Arrêter au bouton');
        
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#1976D2');
        this.setTooltip('Attend que le bouton soit appuyé pour arrêter le programme');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['robotpi_bouton_appuye'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('🔘 bouton appuyé');
        
        this.setOutput(true, 'Boolean');
        this.setColour('#1976D2');
        this.setTooltip('Retourne vrai si le bouton est actuellement appuyé');
        this.setHelpUrl('');
    }
};


Blockly.Blocks['robotpi_arreter_si_bouton'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('⏹️ Arrêter si bouton appuyé');
        
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#D32F2F');
        this.setTooltip('Arrête le robot et sort de la boucle si le bouton est appuyé');
        this.setHelpUrl('');
    }
};

console.log('✅ Fin du chargement de robotpi_bouton.js');

