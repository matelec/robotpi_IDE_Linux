// fichier de génération Python pour les blocs Blockly personnalisés lumieres RobotPi

Blockly.Python.forBlock['robotpi_allumer_leds'] = function(block) {
    const couleur = block.getFieldValue('COULEUR');
    
    // Mapping des couleurs vers les valeurs RGB
    const couleurs = {
        'rouge': '(255, 0, 0)',
        'orange': '(255, 165, 0)',
        'jaune': '(255, 255, 0)',
        'vert': '(0, 255, 0)',
        'bleu': '(0, 0, 255)',
        'indigo': '(75, 0, 130)',
        'violet': '(138, 43, 226)'
    };
    
    const rgb = couleurs[couleur] || '(255, 255, 255)';
    const code = `robot.allumer_leds${rgb}\n`;
    
    return code;
};

Blockly.Python.forBlock['robotpi_allumer_led'] = function(block) {
    const numeroLed = block.getFieldValue('NUMERO_LED');
    const couleur = block.getFieldValue('COULEUR');
    
    // Mapping des couleurs vers les valeurs RGB
    const couleurs = {
        'rouge': '255, 0, 0',
        'orange': '255, 165, 0',
        'jaune': '255, 255, 0',
        'vert': '0, 255, 0',
        'bleu': '0, 0, 255',
        'indigo': '75, 0, 130',
        'violet': '138, 43, 226'
    };
    
    const rgb = couleurs[couleur] || '(255, 255, 255)';
    const code = `robot.allumer_led(${numeroLed-1}, ${rgb})\n`;
    
    return code;
};

Blockly.Python.forBlock['robotpi_eteindre_led'] = function(block) {
    const numeroLed = block.getFieldValue('NUMERO_LED');
    const code = `robot.eteindre_led(${numeroLed-1})\n`;
    return code;
};

Blockly.Python.forBlock['robotpi_eteindre_leds'] = function() {
    const code = 'robot.eteindre_leds()\n';
    return code;
};

Blockly.Python.forBlock['robotpi_clignoter_leds'] = function(block) {
    const couleur = block.getFieldValue('COULEUR');
    
    // Mapping des couleurs vers les valeurs RGB
    const couleurs = {
        'rouge': '255, 0, 0',
        'orange': '255, 165, 0',
        'jaune': '255, 255, 0',
        'vert': '0, 255, 0',
        'bleu': '0, 0, 255',
        'indigo': '75, 0, 130',
        'violet': '138, 43, 226'
    };
    
    const rgb = couleurs[couleur] || '(255, 255, 255)';
    const duree = block.getFieldValue('DUREE');
    const code = `robot.clignoter_leds(${rgb},3,${duree})\n`;
    return code;
};

Blockly.Python.forBlock['robotpi_luminosite_leds'] = function(block) {
    const luminosite = block.getFieldValue('LUMINOSITE');
     // Convertir le pourcentage (0-100) en valeur décimale (0.0-1.0)
    const valeur = (luminosite / 100).toFixed(2);

    const code = `robot.definir_luminosite(${valeur})\n`;
    return code;
};


