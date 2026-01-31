// fichier de génération Python pour les blocs Blockly personnalisés

Blockly.Python.forBlock['robotpi_move_avancer'] = function () {
    return 'robot.avancer()\n';
};

Blockly.Python.forBlock['robotpi_move_avancer_pendant'] = function(block) {
    // Récupérer la durée saisie par l'utilisateur
    const duree = block.getFieldValue('DUREE');
    
    // Générer le code avec la valeur récupérée
    const code = 'robot.avancer_pendant(duree=' + duree + ')\n';
    
    return code;
};

Blockly.Python.forBlock['robotpi_move_reculer'] = function () {
    return 'robot.reculer()\n';
};

Blockly.Python.forBlock['robotpi_move_reculer_pendant'] = function(block) {
    // Récupérer la durée saisie par l'utilisateur
    const duree = block.getFieldValue('DUREE');
    
    // Générer le code avec la valeur récupérée
    const code = 'robot.reculer_pendant(duree=' + duree + ')\n';
    
    return code;
};

Blockly.Python.forBlock['robotpi_move_tourner_gauche'] = function () {
    return 'robot.tourner_gauche()\n';
};

Blockly.Python.forBlock['robotpi_move_tourner_droite'] = function () {
    return 'robot.tourner_droite()\n';
};

Blockly.Python.forBlock['robotpi_move_tourner_gauche_pendant'] = function(block) {
    // Récupérer la durée saisie par l'utilisateur
    const duree = block.getFieldValue('DUREE');
    
    // Générer le code avec la valeur récupérée
    const code = 'robot.tourner_gauche_pendant(duree=' + duree + ')\n';
    
    return code;
};

Blockly.Python.forBlock['robotpi_move_tourner_droite_pendant'] = function(block) {
    // Récupérer la durée saisie par l'utilisateur
    const duree = block.getFieldValue('DUREE');
    
    // Générer le code avec la valeur récupérée
    const code = 'robot.tourner_droite_pendant(duree=' + duree + ')\n';
    
    return code;
};

Blockly.Python.forBlock['robotpi_move_stopper'] = function () {
    return 'robot.stopper()\n';
};

Blockly.Python.forBlock['robotpi_initialiser'] = function () {
    const code = 
        '# Initialisation du robot\n' + 
        'from robotPi import RobotPi\n' +
        'from machine import Pin, I2C\n' +
        'import time\n' +
        'import sys\n' +  
        '\n' +
        '# Initialiser l\'I2C (ajustez les pins selon votre configuration)\n' +
        'i2c = I2C(0,scl=Pin(9), sda=Pin(8), freq=100000)\n' +
        '\n' +
        '# Configuration\n' +
        'robot = RobotPi(\n' +
        '    pwm_g=0, in1_g=1, in2_g=2,\n' +
        '    pwm_d=3, in1_d=4, in2_d=5,\n' +
        '    stby_pin=6, led_pin=15, nb_leds=4,\n' +
        '    pin_bouton=14, i2c=i2c\n' +
        ')\n' +
        '\n' +
        'time.sleep(2)  # Attente de 2 secondes pour la mise en route\n' +
        '\n';
    
    return code;
};