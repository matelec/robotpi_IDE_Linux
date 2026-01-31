// fichiers Blockly pour les blocs RobotPi temporisation personnalisés
console.log('✅ Début du chargement de robotpi_attendre.js');

Blockly.Blocks['robotpi_attendre'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('Attendre (secondes)')
            .appendField(new Blockly.FieldNumber(1, 0, Infinity, 0.1), 'DUREE');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#30d256');
        this.setTooltip('Fait une pause pendant le nombre de secondes spécifié');
        this.setHelpUrl('');
    }
};

console.log('✅ Fin du chargement de robotpi_attendre.js');
