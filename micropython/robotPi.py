"""
Librairie robotPi pour Raspberry Pi Pico avec driver TB6612FNG
Version avec VL53L0X fonctionnel intégré
"""

from machine import Pin, PWM
from neopixel import NeoPixel
import time
from micropython import const
import ustruct

# === Classe VL53L0X complète et fonctionnelle ===

_IO_TIMEOUT = 1000
_SYSRANGE_START = const(0x00)
_EXTSUP_HV = const(0x89)
_MSRC_CONFIG = const(0x60)
_FINAL_RATE_RTN_LIMIT = const(0x44)
_SYSTEM_SEQUENCE = const(0x01)
_SPAD_REF_START = const(0x4f)
_SPAD_ENABLES = const(0xb0)
_REF_EN_START_SELECT = const(0xb6)
_SPAD_NUM_REQUESTED = const(0x4e)
_INTERRUPT_GPIO = const(0x0a)
_INTERRUPT_CLEAR = const(0x0b)
_GPIO_MUX_ACTIVE_HIGH = const(0x84)
_RESULT_INTERRUPT_STATUS = const(0x13)
_RESULT_RANGE_STATUS = const(0x14)
_OSC_CALIBRATE = const(0xf8)
_MEASURE_PERIOD = const(0x04)


class TimeoutError(RuntimeError):
    pass


class VL53L0X:
    def __init__(self, i2c, address=0x29):
        self.i2c = i2c
        self.address = address
        self.init()
        self._started = False

    def _registers(self, register, values=None, struct='B'):
        if values is None:
            size = ustruct.calcsize(struct)
            data = self.i2c.readfrom_mem(self.address, register, size)
            values = ustruct.unpack(struct, data)
            return values
        data = ustruct.pack(struct, *values)
        self.i2c.writeto_mem(self.address, register, data)

    def _register(self, register, value=None, struct='B'):
        if value is None:
            return self._registers(register, struct=struct)[0]
        self._registers(register, (value,), struct=struct)

    def _flag(self, register=0x00, bit=0, value=None):
        data = self._register(register)
        mask = 1 << bit
        if value is None:
            return bool(data & mask)
        elif value:
            data |= mask
        else:
            data &= ~mask
        self._register(register, data)

    def _config(self, *config):
        for register, value in config:
            self._register(register, value)

    def init(self, power2v8=True):
        self._flag(_EXTSUP_HV, 0, power2v8)

        # I2C standard mode
        self._config(
            (0x88, 0x00),

            (0x80, 0x01),
            (0xff, 0x01),
            (0x00, 0x00),
        )
        self._stop_variable = self._register(0x91)
        self._config(
            (0x00, 0x01),
            (0xff, 0x00),
            (0x80, 0x00),
        )

        # disable signal_rate_msrc and signal_rate_pre_range limit checks
        self._flag(_MSRC_CONFIG, 1, True)
        self._flag(_MSRC_CONFIG, 4, True)

        # rate_limit = 0.25
        self._register(_FINAL_RATE_RTN_LIMIT, int(0.25 * (1 << 7)),
                       struct='>H')

        self._register(_SYSTEM_SEQUENCE, 0xff)

        spad_count, is_aperture = self._spad_info()
        spad_map = bytearray(self._registers(_SPAD_ENABLES, struct='6B'))

        # set reference spads
        self._config(
            (0xff, 0x01),
            (_SPAD_REF_START, 0x00),
            (_SPAD_NUM_REQUESTED, 0x2c),
            (0xff, 0x00),
            (_REF_EN_START_SELECT, 0xb4),
        )

        spads_enabled = 0
        for i in range(48):
            if i < 12 and is_aperture or spads_enabled >= spad_count:
                spad_map[i // 8] &= ~(1 << (i >> 2))
            elif spad_map[i // 8] & (1 << (i >> 2)):
                spads_enabled += 1

        self._registers(_SPAD_ENABLES, spad_map, struct='6B')

        self._config(
            (0xff, 0x01),
            (0x00, 0x00),

            (0xff, 0x00),
            (0x09, 0x00),
            (0x10, 0x00),
            (0x11, 0x00),

            (0x24, 0x01),
            (0x25, 0xFF),
            (0x75, 0x00),

            (0xFF, 0x01),
            (0x4E, 0x2C),
            (0x48, 0x00),
            (0x30, 0x20),

            (0xFF, 0x00),
            (0x30, 0x09),
            (0x54, 0x00),
            (0x31, 0x04),
            (0x32, 0x03),
            (0x40, 0x83),
            (0x46, 0x25),
            (0x60, 0x00),
            (0x27, 0x00),
            (0x50, 0x06),
            (0x51, 0x00),
            (0x52, 0x96),
            (0x56, 0x08),
            (0x57, 0x30),
            (0x61, 0x00),
            (0x62, 0x00),
            (0x64, 0x00),
            (0x65, 0x00),
            (0x66, 0xA0),

            (0xFF, 0x01),
            (0x22, 0x32),
            (0x47, 0x14),
            (0x49, 0xFF),
            (0x4A, 0x00),

            (0xFF, 0x00),
            (0x7A, 0x0A),
            (0x7B, 0x00),
            (0x78, 0x21),

            (0xFF, 0x01),
            (0x23, 0x34),
            (0x42, 0x00),
            (0x44, 0xFF),
            (0x45, 0x26),
            (0x46, 0x05),
            (0x40, 0x40),
            (0x0E, 0x06),
            (0x20, 0x1A),
            (0x43, 0x40),

            (0xFF, 0x00),
            (0x34, 0x03),
            (0x35, 0x44),

            (0xFF, 0x01),
            (0x31, 0x04),
            (0x4B, 0x09),
            (0x4C, 0x05),
            (0x4D, 0x04),

            (0xFF, 0x00),
            (0x44, 0x00),
            (0x45, 0x20),
            (0x47, 0x08),
            (0x48, 0x28),
            (0x67, 0x00),
            (0x70, 0x04),
            (0x71, 0x01),
            (0x72, 0xFE),
            (0x76, 0x00),
            (0x77, 0x00),

            (0xFF, 0x01),
            (0x0D, 0x01),

            (0xFF, 0x00),
            (0x80, 0x01),
            (0x01, 0xF8),

            (0xFF, 0x01),
            (0x8E, 0x01),
            (0x00, 0x01),
            (0xFF, 0x00),
            (0x80, 0x00),
        )

        self._register(_INTERRUPT_GPIO, 0x04)
        self._flag(_GPIO_MUX_ACTIVE_HIGH, 4, False)
        self._register(_INTERRUPT_CLEAR, 0x01)

        self._register(_SYSTEM_SEQUENCE, 0x01)
        self._calibrate(0x40)
        self._register(_SYSTEM_SEQUENCE, 0x02)
        self._calibrate(0x00)

        self._register(_SYSTEM_SEQUENCE, 0xe8)

    def _spad_info(self):
        self._config(
            (0x80, 0x01),
            (0xff, 0x01),
            (0x00, 0x00),

            (0xff, 0x06),
        )
        self._flag(0x83, 3, True)
        self._config(
            (0xff, 0x07),
            (0x81, 0x01),

            (0x80, 0x01),

            (0x94, 0x6b),
            (0x83, 0x00),
        )
        for timeout in range(_IO_TIMEOUT):
            if self._register(0x83):
                break
            time.sleep_ms(1)
        else:
            raise TimeoutError()
        self._config(
            (0x83, 0x01),
        )
        value = self._register(0x92)
        self._config(
            (0x81, 0x00),
            (0xff, 0x06),
        )
        self._flag(0x83, 3, False)
        self._config(
            (0xff, 0x01),
            (0x00, 0x01),

            (0xff, 0x00),
            (0x80, 0x00),
        )
        count = value & 0x7f
        is_aperture = bool(value & 0b10000000)
        return count, is_aperture

    def _calibrate(self, vhv_init_byte):
        self._register(_SYSRANGE_START, 0x01 | vhv_init_byte)
        for timeout in range(_IO_TIMEOUT):
            if self._register(_RESULT_INTERRUPT_STATUS) & 0x07:
                break
            time.sleep_ms(1)
        else:
            raise TimeoutError()
        self._register(_INTERRUPT_CLEAR, 0x01)
        self._register(_SYSRANGE_START, 0x00)

    def start(self, period=0):
        self._config(
          (0x80, 0x01),
          (0xFF, 0x01),
          (0x00, 0x00),
          (0x91, self._stop_variable),
          (0x00, 0x01),
          (0xFF, 0x00),
          (0x80, 0x00),
        )
        if period:
            oscilator = self._register(_OSC_CALIBRATE, struct='>H')
            if oscilator:
                period *= oscilator
            self._register(_MEASURE_PERIOD, period, struct='>H')
            self._register(_SYSRANGE_START, 0x04)
        else:
            self._register(_SYSRANGE_START, 0x02)
        self._started = True

    def stop(self):
        self._register(_SYSRANGE_START, 0x01)
        self._config(
          (0xFF, 0x01),
          (0x00, 0x00),
          (0x91, self._stop_variable),
          (0x00, 0x01),
          (0xFF, 0x00),
        )
        self._started = False

    def read(self):
        """Lit la distance en millimètres"""
        if not self._started:
            self._config(
              (0x80, 0x01),
              (0xFF, 0x01),
              (0x00, 0x00),
              (0x91, self._stop_variable),
              (0x00, 0x01),
              (0xFF, 0x00),
              (0x80, 0x00),
              (_SYSRANGE_START, 0x01),
            )
            for timeout in range(_IO_TIMEOUT):
                if not self._register(_SYSRANGE_START) & 0x01:
                    break
                time.sleep_ms(1)
            else:
                raise TimeoutError()
        for timeout in range(_IO_TIMEOUT):
            if self._register(_RESULT_INTERRUPT_STATUS) & 0x07:
                break
            time.sleep_ms(1)
        else:
            raise TimeoutError()
        value = self._register(_RESULT_RANGE_STATUS + 10, struct='>H')
        self._register(_INTERRUPT_CLEAR, 0x01)
        return value

class MoteurTB6612:
    def __init__(self, pwm_pin, in1_pin, in2_pin, freq=100):
        self.pwm = PWM(Pin(pwm_pin, Pin.OUT))
        self.pwm.freq(freq)
        self.in1 = Pin(in1_pin, Pin.OUT)
        self.in2 = Pin(in2_pin, Pin.OUT)
        self.stopper()

    def avancer(self, vitesse):
        vitesse = max(0, min(100, vitesse))
        duty = int((vitesse / 100 )* 65535)
        self.in1.off()
        self.in2.on()
        self.pwm.duty_u16(duty)
    
    def reculer(self, vitesse):
        vitesse = max(0, min(100, vitesse))
        duty = int((vitesse / 100 )* 65535)
        self.in1.on()
        self.in2.off()
        self.pwm.duty_u16(duty)
    
    def stopper(self):
        self.in1.off()
        self.in2.off()
        self.pwm.duty_u16(0)

class RobotPi:
    def __init__(self, pwm_g, in1_g, in2_g, pwm_d, in1_d, in2_d, stby_pin, led_pin=None, nb_leds=0, pin_bouton=None, i2c=None):
        self.moteur_gauche = MoteurTB6612(pwm_g, in1_g, in2_g)
        self.moteur_droit = MoteurTB6612(pwm_d, in1_d, in2_d)
        
        self.stby = Pin(stby_pin, Pin.OUT)
        self.stby.on()
            
        self.vitesse_defaut = 95 # Vitesse par défaut en pourcentage 0 à 100%
        
        # Initialisation des LEDs WS2812B
        if led_pin is not None:
            self.leds = NeoPixel(Pin(led_pin), nb_leds)
            self.nb_leds = nb_leds
            self.eteindre_leds()
        else:
            self.leds = None
            self.nb_leds = 0
        
        if pin_bouton is not None:
            self.bouton = Pin(pin_bouton, Pin.IN, Pin.PULL_UP)
        else:
            self.bouton = None

        # Initialisation du capteur de distance VL53L0X
        if i2c is not None:
            try:
                self.capteur_distance = VL53L0X(i2c)
                self.capteur_distance.start()  # Démarrage du capteur
                print("✓ Capteur VL53L0X initialisé et démarré")
            except Exception as e:
                print(f"⚠ Erreur init capteur: {e}")
                self.capteur_distance = None
        else:
            self.capteur_distance = None
    
    
    # === Méthodes pour les moteurs ===
    
    def avancer(self, vitesse=None):
        v = vitesse if vitesse is not None else self.vitesse_defaut
        self.moteur_gauche.avancer(v)
        self.moteur_droit.avancer(v)

    def reculer(self, vitesse=None):
        v = vitesse if vitesse is not None else self.vitesse_defaut
        self.moteur_gauche.reculer(v)
        self.moteur_droit.reculer(v)
    
    def tourner_gauche(self, vitesse=None):
        v = vitesse if vitesse is not None else self.vitesse_defaut
        self.moteur_gauche.reculer(v)
        self.moteur_droit.avancer(v)
    
    def tourner_droite(self, vitesse=None):
        v = vitesse if vitesse is not None else self.vitesse_defaut
        self.moteur_gauche.avancer(v)
        self.moteur_droit.reculer(v)
            
    def avancer_pendant(self, vitesse=None, duree=None):
        v = vitesse if vitesse is not None else self.vitesse_defaut
        self.moteur_gauche.avancer(v)
        self.moteur_droit.avancer(v)
        if duree is not None:
            time.sleep(duree)
            self.stopper()
    
    def reculer_pendant(self, vitesse=None, duree=None):
        v = vitesse if vitesse is not None else self.vitesse_defaut
        self.moteur_gauche.reculer(v)
        self.moteur_droit.reculer(v)
        if duree is not None:
            time.sleep(duree)
            self.stopper()
    
    def tourner_gauche_pendant(self, vitesse=None, duree=None):
        v = vitesse if vitesse is not None else self.vitesse_defaut
        self.moteur_gauche.reculer(v)
        self.moteur_droit.avancer(v)
        if duree is not None:
            time.sleep(duree)
            self.stopper()
    
    def tourner_droite_pendant(self, vitesse=None, duree=None):
        v = vitesse if vitesse is not None else self.vitesse_defaut
        self.moteur_gauche.avancer(v)
        self.moteur_droit.reculer(v)
        if duree is not None:
            time.sleep(duree)
            self.stopper()
    
    def stopper(self):
        self.moteur_gauche.stopper()
        self.moteur_droit.stopper()
        
    # === Méthodes pour les LEDs WS2812B ===
    
    def _verifier_leds(self):
        """Vérifie que les LEDs sont initialisées"""
        if self.leds is None:
            raise RuntimeError("LEDs non initialisées. Spécifiez led_pin lors de la création du robot.")
    
    def allumer_led(self, index, r, g, b):
        """Allume une LED spécifique avec une couleur RGB"""
        self._verifier_leds()
        if 0 <= index < self.nb_leds:
            self.leds[index] = (r, g, b)
            self.leds.write()
    
    def allumer_leds(self, r, g, b):
        """Allume toutes les LEDs avec la même couleur RGB"""
        self._verifier_leds()
        for i in range(self.nb_leds):
            self.leds[i] = (r, g, b)
        self.leds.write()
    
    def eteindre_led(self, index):
        """Éteint une LED spécifique"""
        self.allumer_led(index, 0, 0, 0)
    
    def eteindre_leds(self):
        """Éteint toutes les LEDs"""
        self._verifier_leds()
        for i in range(self.nb_leds):
            self.leds[i] = (0, 0, 0)
        self.leds.write()
    
    def couleur_arc_en_ciel(self, index):
        """Affiche une couleur d'arc-en-ciel différente pour chaque LED"""
        self._verifier_leds()
        couleurs = [
            (255, 0, 0),    # Rouge
            (255, 127, 0),  # Orange
            (255, 255, 0),  # Jaune
            (0, 255, 0),    # Vert
            (0, 0, 255),    # Bleu
            (75, 0, 130),   # Indigo
            (148, 0, 211)   # Violet
        ]
        for i in range(self.nb_leds):
            couleur_index = (i + index) % len(couleurs)
            self.leds[i] = couleurs[couleur_index]
        self.leds.write()
    
    def clignoter_leds(self, r, g, b, nb_fois=3, intervalle=0.5):
        """Fait clignoter toutes les LEDs"""
        self._verifier_leds()
        for _ in range(nb_fois):
            self.allumer_leds(r, g, b)
            time.sleep(intervalle)
            self.eteindre_leds()
            time.sleep(intervalle)
    
    def allumer_leds_luminosite(self, r, g, b, luminosite):
        """Ajuste la luminosité globale (0.0 à 1.0)"""
        self._verifier_leds()
        luminosite = max(0.0, min(1.0, luminosite))
        for i in range(self.nb_leds):
            self.leds[i] = (int(r * luminosite), int(g * luminosite), int(b * luminosite))
        self.leds.write()

    def allumer_led_luminosite(self, index, r, g, b, luminosite):
        """Ajuste la luminosité globale (0.0 à 1.0)"""
        self._verifier_leds()
        if 0 <= index < self.nb_leds:
            luminosite = max(0.0, min(1.0, luminosite))
            self.leds[index] = (int(r * luminosite), int(g * luminosite), int(b * luminosite))
            self.leds.write()
        
    
    # === Méthodes pour le capteur de distance VL53L0X ===
    
    def _verifier_capteur(self):
        """Vérifie que le capteur est initialisé"""
        if self.capteur_distance is None:
            raise RuntimeError("Capteur VL53L0X non initialisé. Spécifiez i2c lors de la création du robot.")
    
    def lire_distance(self):
        """Lit la distance en millimètres"""
        self._verifier_capteur()
        try:
            return self.capteur_distance.read()
        except:
            return None
    
    def lire_distance_cm(self):
        """Lit la distance en centimètres"""
        distance = self.lire_distance()
        return round(distance / 10, 1) if distance is not None else None
    
    def obstacle_detecte(self, seuil_cm=20):
        """Retourne True si un obstacle est détecté à moins de seuil_cm"""
        self._verifier_capteur()
        distance = self.lire_distance_cm()
        if distance is None:
            return False
        return distance < seuil_cm
    
    def eviter_obstacle(self, seuil_cm=20, vitesse=None):
        """Évite un obstacle en reculant et tournant"""
        if self.obstacle_detecte(seuil_cm):
            v = vitesse if vitesse is not None else self.vitesse_defaut
            self.reculer_pendant(v, 0.5)
            self.tourner_droite_pendant(v, 0.5)
            self.avancer_pendant()
            return True
        return False


     # === Méthodes pour le bouton ===

    def attendre_bouton_start(self):
        """Attend que le bouton soit appuyé pour continuer"""
        if self.bouton is None:
            raise RuntimeError("Bouton non configuré. Spécifiez pin_bouton lors de la création du robot.")
        
        print("En attente du bouton...")
        while self.bouton.value()==0:  # Attend que le bouton soit appuyé (0 avec PULL_UP)
            time.sleep(0.1)
        
        # Anti-rebond
        time.sleep(1)
        print("Bouton appuyé, démarrage...")

    def attendre_bouton_stop(self):
        """Attend que le bouton soit appuyé pour continuer"""
        if self.bouton is None:
            raise RuntimeError("Bouton non configuré. Spécifiez pin_bouton lors de la création du robot.")
        
        print("En attente du bouton...")
        while self.bouton.value()==0:  # Attend que le bouton soit appuyé (0 avec PULL_UP)
            time.sleep(0.1)
        
        # Anti-rebond
        time.sleep(1)
        print("Bouton appuyé, arrêt...")
        self.stopper()
        self.eteindre_leds()

    def bouton_appuye(self):
        """Retourne True si le bouton est appuyé"""
        if self.bouton is None:
            raise RuntimeError("Bouton non configuré. Spécifiez pin_bouton lors de la création du robot.")
        if self.bouton.value()== 1:
            time.sleep(0.1)  # Anti-rebond
            return True
        return False      
    
    def arreter_si_bouton(self):
        """Arrête le robot si le bouton est appuyé"""
        if self.bouton is None:
            raise RuntimeError("Bouton non configuré. Spécifiez pin_bouton lors de la création du robot.")
        if self.bouton_appuye():
            print("Bouton appuyé, arrêt...")
            self.stopper()
            self.eteindre_leds()
            return True
        return False    

# === Exemples d'utilisation ===

# Initialisation du robot avec LEDs sur le pin GPIO 15
# robot = RobotPi(pwm_g=0, in1_g=1, in2_g=2, 
#                 pwm_d=3, in1_d=4, in2_d=5, 
#                 stby_pin=6, led_pin=15, nb_leds=4)

# Allumer toutes les LEDs en rouge
# robot.allumer_leds(255, 0, 0)

# Allumer la première LED en vert
# robot.allumer_led(0, 0, 255, 0)

# Clignoter en bleu 5 fois
# robot.clignoter_leds(0, 0, 255, nb_fois=5, intervalle=0.3)

# Arc-en-ciel
# robot.couleur_arc_en_ciel(0)

# Éteindre toutes les LEDs
# robot.eteindre_leds()

# --- Exemples Capteur de distance ---
# Lire la distance en millimètres
# distance_mm = robot.lire_distance()
# print(f"Distance: {distance_mm} mm")

# Lire la distance en centimètres
# distance_cm = robot.lire_distance_cm()
# print(f"Distance: {distance_cm} cm")

# Détecter un obstacle
# if robot.obstacle_detecte(seuil_cm=15):
#     print("Obstacle détecté!")
#     robot.allumer_leds(255, 0, 0)  # Rouge
# else:
#     robot.allumer_leds(0, 255, 0)  # Vert

# --- Exemple Robot autonome avec évitement d'obstacles ---
# while True:
#     if robot.obstacle_detecte(seuil_cm=20):
#         robot.allumer_leds(255, 0, 0)  # Rouge si obstacle
#         robot.eviter_obstacle()
#     else:
#         robot.allumer_leds(0, 255, 0)  # Vert si libre
#         robot.avancer(70)
#     time.sleep(0.1)
