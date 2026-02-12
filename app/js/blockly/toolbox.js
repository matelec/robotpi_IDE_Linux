// fichier définissant la boîte à outils (toolbox) pour Blockly

const toolbox = {
    kind: 'categoryToolbox',
    contents: [

        // =====================
        // ROBOTPI (CUSTOM) - Mouvements
        // =====================
        {
            kind: 'category',
            name: 'Mouvements',
            colour: '#FF6F00',
            contents: [
                { kind: 'block', type: 'robotpi_initialiser'  },
                { kind: 'block', type: 'robotpi_move_avancer' },
                { kind: 'block', type: 'robotpi_move_avancer_pendant' },
                { kind: 'block', type: 'robotpi_move_reculer' },
                { kind: 'block', type: 'robotpi_move_reculer_pendant' },
                { kind: 'block', type: 'robotpi_move_tourner_gauche' },
                { kind: 'block', type: 'robotpi_move_tourner_gauche_pendant' },
                { kind: 'block', type: 'robotpi_move_tourner_droite' },
                { kind: 'block', type: 'robotpi_move_tourner_droite_pendant' },
                { kind: 'block', type: 'robotpi_move_stopper' }
            ]
        },

        // =====================
        // ROBOTPI (CUSTOM) - Capteurs
        // =====================
        {
            kind: 'category',
            name: 'Capteurs',
            colour:  '#D32F2F',
            contents: [
                { kind: 'block', type: 'robotpi_obstacle_detection' },
                { kind: 'block', type: 'robotpi_obstacle_eviter' },
                { kind: 'block', type: 'robotpi_lire_distance_cm' },
            ]
        },


        // =====================
        // ROBOTPI (CUSTOM) - Lumières
        // =====================
        {
            kind: 'category',
            name: 'Lumières',
            colour:  '#FBC02D',
            contents: [
                { kind: 'block', type: 'robotpi_allumer_leds' },
                { kind: 'block', type: 'robotpi_allumer_leds_intensite' },
                { kind: 'block', type: 'robotpi_allumer_led' },
                { kind: 'block', type: 'robotpi_allumer_led_intensite' },
                { kind: 'block', type: 'robotpi_eteindre_leds' },
                { kind: 'block', type: 'robotpi_eteindre_led' },
                { kind: 'block', type: 'robotpi_clignoter_leds' }
            ]
        },


        // =====================
        // ROBOTPI (CUSTOM) - Bouton
        // =====================
        {
            kind: 'category',
            name: 'Bouton',
            colour: '#1976D2',
            contents: [
                { kind: 'block', type: 'robotpi_demarrer_au_bouton' },
                { kind: 'block', type: 'robotpi_arreter_au_bouton' },
                { kind: 'block', type: 'robotpi_bouton_appuye' },
                { kind: 'block', type: 'robotpi_arreter_si_bouton' }
            ]
        },

         // =====================
        // ROBOTPI (CUSTOM) - Temporisation
        // =====================
 {
            kind: 'category',
            name: 'Temporisation',
            colour: '#30d256',
            contents: [
                { kind: 'block', type: 'robotpi_attendre' },
            ]
        },

        // =====================
        // LOGIQUE
        // =====================
        {
            kind: 'category',
            name: 'Logique',
            colour: '#5C81A6',
            contents: [
                { kind: 'block', type: 'controls_if' },
                { 
                    kind: 'block', 
                    type: 'logic_compare',
                    fields: {
                        OP: 'EQ'
                    }
                },
                { 
                    kind: 'block', 
                    type: 'logic_operation',
                    fields: {
                        OP: 'AND'
                    }
                },
                // Bloc logic_negate retiré temporairement (problème de locale)
                { 
                    kind: 'block', 
                    type: 'logic_boolean',
                    fields: {
                        BOOL: 'TRUE'
                    }
                },
                { kind: 'block', type: 'logic_null' },
                { kind: 'block', type: 'logic_ternary' }
            ]
        },

        // =====================
        // BOUCLES
        // =====================
        {
            kind: 'category',
            name: 'Boucles',
            colour: '#5CA65C',
            contents: [
                { 
                    kind: 'block', 
                    type: 'controls_repeat_ext',
                    inputs: {
                        TIMES: {
                            shadow: {
                                type: 'math_number',
                                fields: {
                                    NUM: 10
                                }
                            }
                        }
                    }
                },
                { kind: 'block', type: 'controls_whileUntil' },
                { 
                    kind: 'block', 
                    type: 'controls_for',
                    inputs: {
                        FROM: {
                            shadow: {
                                type: 'math_number',
                                fields: { NUM: 1 }
                            }
                        },
                        TO: {
                            shadow: {
                                type: 'math_number',
                                fields: { NUM: 10 }
                            }
                        },
                        BY: {
                            shadow: {
                                type: 'math_number',
                                fields: { NUM: 1 }
                            }
                        }
                    }
                },
                { kind: 'block', type: 'controls_forEach' },
                { kind: 'block', type: 'controls_flow_statements' }
            ]
        },

        // =====================
        // MATHS
        // =====================
        {
            kind: 'category',
            name: 'Maths',
            colour: '#5C68A6',
            contents: [
                { 
                    kind: 'block', 
                    type: 'math_number',
                    fields: {
                        NUM: 0
                    }
                },
                { 
                    kind: 'block', 
                    type: 'math_arithmetic',
                    inputs: {
                        A: {
                            shadow: {
                                type: 'math_number',
                                fields: { NUM: 1 }
                            }
                        },
                        B: {
                            shadow: {
                                type: 'math_number',
                                fields: { NUM: 1 }
                            }
                        }
                    }
                },
                { kind: 'block', type: 'math_single' },
                { kind: 'block', type: 'math_trig' },
                { kind: 'block', type: 'math_constant' },
                { kind: 'block', type: 'math_number_property' },
                { kind: 'block', type: 'math_round' },
                { kind: 'block', type: 'math_on_list' },
                { kind: 'block', type: 'math_modulo' },
                { kind: 'block', type: 'math_constrain' },
                { kind: 'block', type: 'math_random_int' },
                { kind: 'block', type: 'math_random_float' }
            ]
        },

        // =====================
        // TEXTE
        // =====================
        {
            kind: 'category',
            name: 'Texte',
            colour: '#5CA68D',
            contents: [
                { 
                    kind: 'block', 
                    type: 'text',
                    fields: {
                        TEXT: ''
                    }
                },
                { kind: 'block', type: 'text_join' },
                { kind: 'block', type: 'text_append' },
                { kind: 'block', type: 'text_length' },
                { kind: 'block', type: 'text_isEmpty' },
                { kind: 'block', type: 'text_indexOf' },
                { kind: 'block', type: 'text_charAt' },
                { kind: 'block', type: 'text_getSubstring' },
                { kind: 'block', type: 'text_changeCase' },
                { kind: 'block', type: 'text_trim' },
                { 
                    kind: 'block', 
                    type: 'text_print',
                    inputs: {
                        TEXT: {
                            shadow: {
                                type: 'text',
                                fields: { TEXT: 'abc' }
                            }
                        }
                    }
                },
                { kind: 'block', type: 'text_prompt_ext' }
            ]
        },

        // =====================
        // LISTES
        // =====================
        {
            kind: 'category',
            name: 'Listes',
            colour: '#745CA6',
            contents: [
                { kind: 'block', type: 'lists_create_with' },
                { kind: 'block', type: 'lists_repeat' },
                { kind: 'block', type: 'lists_length' },
                { kind: 'block', type: 'lists_isEmpty' },
                { kind: 'block', type: 'lists_indexOf' },
                { kind: 'block', type: 'lists_getIndex' },
                { kind: 'block', type: 'lists_setIndex' },
                { kind: 'block', type: 'lists_getSublist' },
                { kind: 'block', type: 'lists_split' },
                { kind: 'block', type: 'lists_sort' }
            ]
        },

        // =====================
        // VARIABLES (DYNAMIQUE)
        // =====================
        {
            kind: 'category',
            name: 'Variables',
            colour: '#A65C81',
            custom: 'VARIABLE'
        },

        // =====================
        // FONCTIONS
        // =====================
        {
            kind: 'category',
            name: 'Fonctions',
            colour: '#9A5CA6',
            custom: 'PROCEDURE'
        }
    ]
};