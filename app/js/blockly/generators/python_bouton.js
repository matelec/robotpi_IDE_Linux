// fichier de génération Python pour les blocs Blockly personnalisés bouton RobotPi

Blockly.Python.forBlock['robotpi_demarrer_au_bouton'] = function(block) {
    const code = 'robot.attendre_bouton_start()\n';
    return code;
};

Blockly.Python.forBlock['robotpi_arreter_au_bouton'] = function(block) {
    const code = 'robot.attendre_bouton_stop()\n';
    return code;
};

Blockly.Python.forBlock['robotpi_bouton_appuye'] = function(block) {
    const code = 'robot.bouton_appuye()';
    return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python.forBlock['robotpi_arreter_si_bouton'] = function(block) {
    const code = 'if robot.arreter_si_bouton():\n' +
        '    break\n';  
    return code;
};



