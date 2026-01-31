# 🤖 robotPi - Librairie Robot pour Raspberry Pi Pico

Librairie complète pour contrôler un robot mobile basé sur Raspberry Pi Pico avec driver moteur TB6612FNG, capteur de distance VL53L0X et LEDs WS2812B.

## 📦 Fonctionnalités

- ✅ Contrôle de 2 moteurs DC via TB6612FNG
- ✅ Capteur de distance laser VL53L0X (jusqu'à 2m)
- ✅ 4 LEDs RGB WS2812B programmables
- ✅ Fonctions de mouvement avec durée
- ✅ Évitement d'obstacles automatique
- ✅ Support bouton tactile

## 🔌 Schéma de câblage

### ⚡ Alimentation par batterie Li-ion 18650

**Configuration recommandée :**
- **2x batteries 18650 en série** = 7.4V nominal (8.4V chargées, 6V déchargées)
- Support 2x 18650 avec protection intégrée
- Module de charge TP4056 (avec protection) pour chaque batterie
- Interrupteur ON/OFF sur le +

**Schéma d'alimentation :**
```
Batteries 18650 (2S)
    │
    ├─→ Interrupteur ON/OFF
    │
    ├─→ VM (TB6612FNG)  ← Alimente les moteurs (7.4V)
    │
    └─→ VSYS (Pico)     ← Alimente le Pico (via régulateur interne)
         │
         └─→ 3.3V sort automatiquement sur pin 3V3
              │
              ├─→ VCC TB6612FNG
              ├─→ VCC VL53L0X
              └─→ GND commun
    
    VBUS (Pico) → VCC WS2812B  ← 5V généré par le régulateur du Pico
```

⚠️ **Important :**
- Ne jamais brancher USB et batteries en même temps
- Utiliser un support avec protection contre décharge profonde
- Tension minimale : 6V (3V par cellule)
- Courant de pointe moteurs : ~2A par moteur

### TB6612FNG (Contrôleur moteurs)
```
PWMA  → GPIO 0   (PWM moteur gauche)
AIN1  → GPIO 1
AIN2  → GPIO 2
PWMB  → GPIO 3   (PWM moteur droit)
BIN1  → GPIO 4
BIN2  → GPIO 5
STBY  → GPIO 6   (Standby)
VCC   → 3.3V     (du Pico)
GND   → GND      (commun)
VM    → 7.4V     (batteries 18650 2S)
```

### VL53L0X (Capteur distance)
```
VCC → 3.3V
GND → GND
SCL → GPIO 9
SDA → GPIO 8
```

### WS2812B (LEDs RGB)
```
VCC → VBUS (5V du Pico, pin 40)
GND → GND
DIN → GPIO 15
```
⚠️ **Note :** Le Pico génère du 5V sur VBUS uniquement quand alimenté par VSYS (batteries) ou USB

### Bouton tactile (optionnel)
```
Un côté     → GPIO 14
Autre côté  → GND
```
*Note: Utilise le pull-up interne*

## 🚀 Installation

1. Copiez `robotPi.py` sur votre Raspberry Pi Pico
2. Importez la librairie dans votre code :

```python
from machine import I2C, Pin
import robotPi
```

## 📖 Utilisation de base

### Initialisation simple (moteurs uniquement)

```python
robot = robotPi.RobotPi(
    pwm_g=0, in1_g=1, in2_g=2,    # Moteur gauche
    pwm_d=3, in1_d=4, in2_d=5,    # Moteur droit
    stby_pin=6                     # Standby
)
```

### Initialisation complète (avec LEDs et capteur)

```python
from machine import I2C, Pin
import robotPi

# Configuration I2C pour le capteur
i2c = I2C(0, scl=Pin(9), sda=Pin(8), freq=400000)

# Création du robot
robot = robotPi.RobotPi(
    pwm_g=0, in1_g=1, in2_g=2,
    pwm_d=3, in1_d=4, in2_d=5,
    stby_pin=6,
    led_pin=15,      # LEDs WS2812B
    nb_leds=4,       # Nombre de LEDs
    i2c=i2c          # Bus I2C pour VL53L0X
)
```

## 🎮 Contrôle des moteurs

### Mouvements continus

```python
# Avancer à vitesse par défaut (70%)
robot.avancer()

# Avancer à vitesse spécifique
robot.avancer(vitesse=50)

# Reculer
robot.reculer(vitesse=60)

# Tourner à gauche
robot.tourner_gauche(vitesse=70)

# Tourner à droite
robot.tourner_droite(vitesse=70)

# Arrêter
robot.stopper()
```

### Mouvements avec durée

```python
# Avancer pendant 2 secondes puis s'arrêter
robot.avancer_pendant(duree=2, vitesse=70)

# Reculer pendant 1.5 secondes
robot.reculer_pendant(duree=1.5, vitesse=60)

# Tourner à gauche pendant 0.5 secondes
robot.tourner_gauche_pendant(duree=0.5)

# Tourner à droite pendant 0.8 secondes
robot.tourner_droite_pendant(duree=0.8, vitesse=80)
```

## 💡 Contrôle des LEDs

### Allumer/Éteindre

```python
# Allumer toutes les LEDs en rouge (R, G, B)
robot.allumer_leds(255, 0, 0)

# Allumer toutes les LEDs en vert
robot.allumer_leds(0, 255, 0)

# Allumer toutes les LEDs en bleu
robot.allumer_leds(0, 0, 255)

# Allumer une LED spécifique (index 0-3)
robot.allumer_led(0, 255, 0, 0)  # Première LED en rouge

# Éteindre toutes les LEDs
robot.eteindre_leds()

# Éteindre une LED spécifique
robot.eteindre_led(0)
```

### Effets lumineux

```python
# Clignoter en rouge 5 fois
robot.clignoter_leds(255, 0, 0, nb_fois=5, intervalle=0.3)

# Arc-en-ciel
robot.couleur_arc_en_ciel(0)

# Ajuster la luminosité (0.0 à 1.0)
robot.allumer_leds(255, 0, 0)
robot.definir_luminosite(0.5)  # 50% de luminosité
```

## 📏 Capteur de distance

### Lecture de distance

```python
# Lire en millimètres
distance_mm = robot.lire_distance()
print(f"Distance: {distance_mm} mm")

# Lire en centimètres
distance_cm = robot.lire_distance_cm()
print(f"Distance: {distance_cm} cm")
```

### Détection d'obstacles

```python
# Vérifier si obstacle à moins de 20 cm
if robot.obstacle_detecte(seuil_cm=20):
    print("Obstacle détecté !")
    robot.allumer_leds(255, 0, 0)  # Rouge
else:
    robot.allumer_leds(0, 255, 0)  # Vert

# Éviter automatiquement un obstacle
# (recule 0.5s puis tourne à droite 0.5s)
robot.eviter_obstacle(seuil_cm=20, vitesse=70)
```

## 🎯 Exemples complets

### Exemple 1 : Parcours simple

```python
import robotPi
import time

robot = robotPi.RobotPi(0, 1, 2, 3, 4, 5, stby_pin=6)

# Carré
for i in range(4):
    robot.avancer_pendant(duree=2, vitesse=70)
    robot.tourner_droite_pendant(duree=0.5, vitesse=70)
    time.sleep(0.5)
```

### Exemple 2 : Robot autonome avec évitement

```python
from machine import I2C, Pin
import robotPi
import time

# Initialisation
i2c = I2C(0, scl=Pin(9), sda=Pin(8), freq=400000)
robot = robotPi.RobotPi(0, 1, 2, 3, 4, 5, 
                        stby_pin=6, led_pin=15, i2c=i2c)

# Boucle principale
while True:
    if robot.obstacle_detecte(seuil_cm=20):
        # Obstacle détecté - LEDs rouges
        robot.allumer_leds(255, 0, 0)
        robot.eviter_obstacle()
    else:
        # Voie libre - LEDs vertes
        robot.allumer_leds(0, 255, 0)
        robot.avancer(70)
    
    time.sleep(0.1)
```

### Exemple 3 : Contrôle par bouton

```python
from machine import I2C, Pin
import robotPi
import time

# Initialisation
i2c = I2C(0, scl=Pin(9), sda=Pin(8), freq=400000)
bouton = Pin(14, Pin.IN, Pin.PULL_UP)
robot = robotPi.RobotPi(0, 1, 2, 3, 4, 5, 
                        stby_pin=6, led_pin=15, i2c=i2c)

actif = False

print("Appuyez sur le bouton pour démarrer/arrêter")

while True:
    # Détection appui bouton
    if bouton.value() == 0:  # Bouton pressé
        actif = not actif
        time.sleep(0.3)  # Anti-rebond
        
        if actif:
            robot.allumer_leds(0, 255, 0)
            print("🟢 Robot activé")
        else:
            robot.stopper()
            robot.allumer_leds(255, 0, 0)
            print("🔴 Robot désactivé")
    
    # Mode automatique si activé
    if actif:
        if robot.obstacle_detecte(seuil_cm=20):
            robot.allumer_leds(255, 165, 0)  # Orange
            robot.eviter_obstacle()
        else:
            robot.allumer_leds(0, 255, 0)  # Vert
            robot.avancer(70)
    
    time.sleep(0.1)
```

### Exemple 4 : Indicateur de distance avec LEDs

```python
from machine import I2C, Pin
import robotPi
import time

i2c = I2C(0, scl=Pin(9), sda=Pin(8), freq=400000)
robot = robotPi.RobotPi(0, 1, 2, 3, 4, 5, 
                        stby_pin=6, led_pin=15, i2c=i2c)

while True:
    distance = robot.lire_distance_cm()
    
    if distance is not None:
        if distance < 10:
            robot.allumer_leds(255, 0, 0)      # Rouge < 10cm
        elif distance < 20:
            robot.allumer_leds(255, 165, 0)    # Orange < 20cm
        elif distance < 30:
            robot.allumer_leds(255, 255, 0)    # Jaune < 30cm
        else:
            robot.allumer_leds(0, 255, 0)      # Vert > 30cm
        
        print(f"Distance: {distance:.1f} cm")
    
    time.sleep(0.2)
```

## ⚙️ Configuration avancée

### Modifier la vitesse par défaut

```python
robot = robotPi.RobotPi(0, 1, 2, 3, 4, 5)
robot.vitesse_defaut = 80  # 80% au lieu de 70%
```

### Utilisation sans composants optionnels

```python
# Sans LEDs ni capteur
robot = robotPi.RobotPi(0, 1, 2, 3, 4, 5, stby_pin=6)

# Seulement avec LEDs
robot = robotPi.RobotPi(0, 1, 2, 3, 4, 5, 
                        stby_pin=6, led_pin=15, nb_leds=4)

# Seulement avec capteur
i2c = I2C(0, scl=Pin(9), sda=Pin(8), freq=400000)
robot = robotPi.RobotPi(0, 1, 2, 3, 4, 5, 
                        stby_pin=6, i2c=i2c)
```

## 📚 API Complète

### Classe RobotPi

#### Méthodes de mouvement
- `avancer(vitesse=None)` - Mouvement continu
- `reculer(vitesse=None)` - Mouvement continu
- `tourner_gauche(vitesse=None)` - Mouvement continu
- `tourner_droite(vitesse=None)` - Mouvement continu
- `avancer_pendant(duree, vitesse=None)` - Avec arrêt automatique
- `reculer_pendant(duree, vitesse=None)` - Avec arrêt automatique
- `tourner_gauche_pendant(duree, vitesse=None)` - Avec arrêt automatique
- `tourner_droite_pendant(duree, vitesse=None)` - Avec arrêt automatique
- `stopper()` - Arrêt complet

#### Méthodes LEDs
- `allumer_led(index, r, g, b)` - Allume une LED
- `allumer_leds(r, g, b)` - Allume toutes les LEDs
- `eteindre_led(index)` - Éteint une LED
- `eteindre_leds()` - Éteint toutes les LEDs
- `couleur_arc_en_ciel(index)` - Effet arc-en-ciel
- `clignoter_leds(r, g, b, nb_fois=3, intervalle=0.5)` - Clignotement
- `definir_luminosite(luminosite)` - Ajuste luminosité (0.0-1.0)

#### Méthodes capteur de distance
- `lire_distance()` - Distance en millimètres
- `lire_distance_cm()` - Distance en centimètres
- `obstacle_detecte(seuil_cm=20)` - Détection booléenne
- `eviter_obstacle(seuil_cm=20, vitesse=None)` - Évitement automatique

## 🔧 Dépannage

### Le robot ne bouge pas
- Vérifier que STBY est connecté et à HIGH
- Vérifier l'alimentation VM du TB6612FNG (7.4V batteries)
- Vérifier les connexions des moteurs
- Vérifier la charge des batteries (>6V)
- Vérifier l'interrupteur ON/OFF

### Les LEDs ne s'allument pas
- Vérifier que les batteries alimentent bien le Pico (VSYS)
- Vérifier que VBUS (pin 40) fournit bien 5V
- Vérifier la connexion DIN sur GPIO 15
- Vérifier le nombre de LEDs (nb_leds=4)
- Les WS2812B ne fonctionnent pas en USB uniquement si VSYS n'est pas alimenté

### Le capteur ne fonctionne pas
- Vérifier les connexions I2C (SCL=9, SDA=8)
- Vérifier l'alimentation 3.3V du capteur
- Tester avec un scanner I2C :
```python
i2c = I2C(0, scl=Pin(9), sda=Pin(8), freq=400000)
print(i2c.scan())  # Devrait afficher [41] (0x29 en décimal)
```

### Autonomie faible
- Vérifier la capacité des batteries (recommandé : 2500-3500mAh)
- Réduire la vitesse par défaut : `robot.vitesse_defaut = 50`
- Réduire la luminosité des LEDs : `robot.definir_luminosite(0.3)`
- Éteindre les LEDs quand inutiles : `robot.eteindre_leds()`

### Les batteries ne se chargent pas
- Vérifier les modules TP4056 (LED rouge = charge, verte = complète)
- Vérifier les connexions de charge
- Ne jamais charger avec le robot allumé (éteindre l'interrupteur)

## 🔋 Conseils d'utilisation des batteries

### Charge
- Utiliser des modules TP4056 avec protection
- Temps de charge : ~3-4h pour 2500mAh
- Toujours éteindre le robot pendant la charge

### Utilisation
- Tension nominale : 7.4V (2S)
- Tension max : 8.4V (chargées)
- Tension min : 6V (ne pas descendre en dessous)
- Autonomie estimée avec 2500mAh : 45-60 minutes

### Sécurité
- ⚠️ Ne jamais court-circuiter les batteries
- ⚠️ Ne jamais percer ou chauffer les batteries
- ⚠️ Utiliser uniquement des batteries avec protection PCB
- ⚠️ Arrêter le robot si tension < 6V (vérifier avec voltmètre)

## 📝 Licence

Cette librairie est distribuée sous licence MIT.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à proposer des améliorations.

---

**Créé pour Raspberry Pi Pico avec MicroPython** 🐍