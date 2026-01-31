// fichiers Blockly pour les blocs RobotPi capteurs personnalisés
console.log('✅ Début du chargement de robotpi_capteurs.js');

Blockly.Blocks['robotpi_allumer_leds'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('Allumer toutes les LEDs en')
            .appendField(new Blockly.FieldDropdown([
                ['Rouge', 'rouge'],
                ['Orange', 'orange'],
                ['Jaune', 'jaune'],
                ['Vert', 'vert'],
                ['Bleu', 'bleu'],
                ['Indigo', 'indigo'],
                ['Violet', 'violet']
            ]), 'COULEUR');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#FBC02D');
        this.setTooltip('Allume toutes les LEDs avec la couleur choisie');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['robotpi_allumer_led'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('Allumer LED n°')
            .appendField(new Blockly.FieldNumber(1, 1, 8, 1), 'NUMERO_LED')
            .appendField('en')
            .appendField(new Blockly.FieldDropdown([
                ['Rouge', 'rouge'],
                ['Orange', 'orange'],
                ['Jaune', 'jaune'],
                ['Vert', 'vert'],
                ['Bleu', 'bleu'],
                ['Indigo', 'indigo'],
                ['Violet', 'violet']
            ]), 'COULEUR');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#FBC02D');
        this.setTooltip('Allume la LED spécifiée avec la couleur choisie');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['robotpi_eteindre_led'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('Éteindre LED n°')
            .appendField(new Blockly.FieldNumber(1, 1, 8, 1), 'NUMERO_LED');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#FBC02D');
        this.setTooltip('Éteint la LED spécifiée');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['robotpi_eteindre_leds'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('Éteindre toutes les LEDs');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#FBC02D');
        this.setTooltip('Éteint toutes les LEDs');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['robotpi_clignoter_leds'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('Faire clignoter toutes les LEDs en')
            .appendField(new Blockly.FieldDropdown([
                ['Rouge', 'rouge'],
                ['Orange', 'orange'],
                ['Jaune', 'jaune'],
                ['Vert', 'vert'],
                ['Bleu', 'bleu'],
                ['Indigo', 'indigo'],
                ['Violet', 'violet']
            ]), 'COULEUR')
            .appendField('pendant')
            .appendField(new Blockly.FieldNumber(1, 0, 100, 0.1), 'DUREE')
            .appendField('secondes');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#FBC02D');
        this.setTooltip('Fait clignoter toutes les LEDs avec la couleur choisie pendant un temps donné');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['robotpi_luminosite_leds'] = {
    init: function () {
        this.appendDummyInput()
            .appendField('Régler la luminosité des LEDs à')
            .appendField(new Blockly.FieldNumber(100, 0, 100, 1), 'LUMINOSITE')
            .appendField('%');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#FBC02D');
        this.setTooltip('Règle la luminosité de toutes les LEDs (0 à 100%)');
        this.setHelpUrl('');
    }
};

console.log('✅ Fin du chargement de robotpi_capteurs.js');