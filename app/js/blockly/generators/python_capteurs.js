// fichier de génération Python pour les blocs Blockly personnalisés capteurs RobotPi

Blockly.Python.forBlock['robotpi_obstacle_detection'] = function () {
    const code = 'robot.obstacle_devant()';
    return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Python.forBlock['robotpi_obstacle_eviter'] = function () {
    const code = 'robot.eviter_obstacle()\n';
    return code;
};

Blockly.Python.forBlock['robotpi_lire_distance_cm'] = function () {
    const code = 'robot.lire_distance_cm()';
    return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};
