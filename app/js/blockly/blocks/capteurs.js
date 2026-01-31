// fichiers Blockly pour les blocs RobotPi capteurs personnalisés
console.log('✅ Début du chargement de robotpi_capteurs.js');

Blockly.Blocks['robotpi_obstacle_detection'] = {
    init: function () {
       this.appendDummyInput()
            .appendField('Obstacle devant ?');

        this.setOutput(true, 'Boolean');
        this.setColour('#D32F2F');
        this.setTooltip('f');
        this.setHelpUrl('');
    }
};


Blockly.Blocks['robotpi_obstacle_eviter'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('Eviter obstacle distance <= 20 cm');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#D32F2F');
        this.setTooltip('Evite un obstacle devant le robot <= 20 cm');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['robotpi_lire_distance_cm'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('Lire distance en cm');

        this.setOutput(true, 'Number');
        this.setColour('#D32F2F');
        this.setTooltip('Lit la distance en cm mesurée par le capteur de distance');
        this.setHelpUrl('');
    }
};

console.log('✅ Fin du chargement de robotpi_capteurs.js'); 