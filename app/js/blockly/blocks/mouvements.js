// fichiers Blockly pour les blocs RobotPi personnalisés

Blockly.Blocks['robotpi_move_avancer'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('Avancer');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#FF6F00');
        this.setTooltip('Fait avancer le robot');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['robotpi_move_avancer_pendant'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('Avancer pendant')
            .appendField(new Blockly.FieldNumber(1, 0, 100, 0.1), 'DUREE')
            .appendField('secondes');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#FF6F00');
        this.setTooltip('Fait avancer le robot pendant un temps donné');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['robotpi_move_reculer'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('Reculer');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#FF6F00');
        this.setTooltip('Fait reculer le robot');
        this.setHelpUrl('');
    }
};


Blockly.Blocks['robotpi_move_reculer_pendant'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('Reculer pendant')
            .appendField(new Blockly.FieldNumber(1, 0, 100, 0.1), 'DUREE')
            .appendField('secondes');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#FF6F00');
        this.setTooltip('Fait reculer le robot pendant un temps donné');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['robotpi_initialiser'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('Initaliser le robot');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#FF6F00');
        this.setTooltip('Initialise le robot');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['robotpi_move_tourner_gauche'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('Tourner à gauche');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#FF6F00');
        this.setTooltip('Fait tourner le robot à gauche');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['robotpi_move_tourner_gauche_pendant'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('Tourner à gauche pendant')
            .appendField(new Blockly.FieldNumber(1, 0, 100, 0.1), 'DUREE')
            .appendField('secondes');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#FF6F00');
        this.setTooltip('Fait tourner le robot à gauche pendant un temps donné');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['robotpi_move_tourner_droite'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('Tourner à droite');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#FF6F00');
        this.setTooltip('Fait tourner le robot à droite');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['robotpi_move_tourner_droite_pendant'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('Tourner à droite pendant')
            .appendField(new Blockly.FieldNumber(1, 0, 100, 0.1), 'DUREE')
            .appendField('secondes');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#FF6F00');
        this.setTooltip('Fait tourner le robot à droite pendant un temps donné');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['robotpi_move_stopper'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('Stopper');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#FF6F00');
        this.setTooltip('Fait stopper le robot');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['robotpi_obstacle_eviter'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('Eviter obstacle disatnce <= 20 cm');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#FF6F00');
        this.setTooltip('Evite un obstacle devant le robot <= 20 cm');
        this.setHelpUrl('');
    }
};
