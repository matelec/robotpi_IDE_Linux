// Générateur de code Python pour le bloc "Attendre"

Blockly.Python.forBlock['robotpi_attendre'] = function(block) {
    // Récupérer la durée saisie par l'utilisateur
    const duree = block.getFieldValue('DUREE');
    
    // Générer le code avec la valeur récupérée
    const code = 'time.sleep(' + duree + ')\n';
    
    return code;
}
