// =============================================================================
// Machine Efficiency Monitor System (MEMS) — ESP32 Tower-Light Monitor
// =============================================================================
// Reads Green / Red tower-light signals, debounces the result, and publishes
// state changes over MQTT.  An LWT message ensures the broker marks the
// device as OFFLINE if it disconnects unexpectedly.
//
// Arduino framework  •  PubSubClient library
// =============================================================================

#include <WiFi.h>
#include <PubSubClient.h>

// ── Wi-Fi credentials ───────────────────────────────────────────────────────
const char* WIFI_SSID     = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// ── MQTT broker settings ────────────────────────────────────────────────────
const char* MQTT_BROKER   = "YOUR_MQTT_BROKER_IP";
const int   MQTT_PORT     = 1883;
const char* MQTT_CLIENT   = "esp32_asm_ad838";

// ── MQTT topic ──────────────────────────────────────────────────────────────
const char* TOPIC_STATE   = "mems/asm_ad838/state";

// ── GPIO pin definitions ────────────────────────────────────────────────────
// Connect to opto-isolated relay outputs from the tower light.
const int PIN_GREEN_LIGHT = 34;   // GPIO 34 — input only, no internal pull-up
const int PIN_RED_LIGHT   = 35;   // GPIO 35 — input only, no internal pull-up

// ── Debounce parameters ─────────────────────────────────────────────────────
// The raw reading must remain stable for DEBOUNCE_MS before we accept it.
const unsigned long DEBOUNCE_MS = 3000;  // 3 seconds

// ── State definitions ───────────────────────────────────────────────────────
enum MachineState {
    STATE_RUNNING,   // Green ON
    STATE_DOWN,      // Red ON
    STATE_IDLE       // Both OFF
};

// ── Global objects ──────────────────────────────────────────────────────────
WiFiClient   wifiClient;
PubSubClient mqttClient(wifiClient);

// ── State-tracking variables ────────────────────────────────────────────────
MachineState confirmedState   = STATE_IDLE;   // Last published (debounced) state
MachineState candidateState   = STATE_IDLE;   // Current raw reading
unsigned long candidateStart  = 0;            // millis() when candidate first appeared

// =============================================================================
// Helpers
// =============================================================================

/**
 * @brief  Convert a MachineState enum to its MQTT-payload string.
 */
const char* stateToString(MachineState s) {
    switch (s) {
        case STATE_RUNNING: return "RUNNING";
        case STATE_DOWN:    return "DOWN";
        case STATE_IDLE:    return "IDLE";
        default:            return "IDLE";
    }
}

/**
 * @brief  Read the two tower-light pins and return the raw machine state.
 *
 *         Logic:
 *           - Green ON              → RUNNING
 *           - Red   ON              → DOWN
 *           - Both  OFF (or both ON → treated as IDLE / fault)
 */
MachineState readRawState() {
    bool greenOn = digitalRead(PIN_GREEN_LIGHT) == HIGH;
    bool redOn   = digitalRead(PIN_RED_LIGHT)   == HIGH;

    if (greenOn && !redOn)  return STATE_RUNNING;
    if (redOn   && !greenOn) return STATE_DOWN;
    return STATE_IDLE;
}

// =============================================================================
// Wi-Fi
// =============================================================================

/**
 * @brief  Block until Wi-Fi is connected (with serial progress dots).
 */
void connectWiFi() {
    Serial.printf("[WiFi] Connecting to %s", WIFI_SSID);
    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }

    Serial.printf("\n[WiFi] Connected — IP: %s\n", WiFi.localIP().toString().c_str());
}

// =============================================================================
// MQTT
// =============================================================================

/**
 * @brief  Connect (or reconnect) to the MQTT broker.
 *
 *         The Last Will and Testament (LWT) is configured here so the broker
 *         automatically publishes "OFFLINE" on our topic if we drop off.
 */
void connectMQTT() {
    mqttClient.setServer(MQTT_BROKER, MQTT_PORT);

    while (!mqttClient.connected()) {
        Serial.print("[MQTT] Connecting to broker...");

        // connect(clientId, username, password,
        //         willTopic, willQoS, willRetain, willMessage)
        bool ok = mqttClient.connect(
            MQTT_CLIENT,       // client ID
            nullptr,           // username  (set if needed)
            nullptr,           // password  (set if needed)
            TOPIC_STATE,       // LWT topic
            1,                 // LWT QoS
            true,              // LWT retain
            "OFFLINE"          // LWT payload
        );

        if (ok) {
            Serial.println(" connected.");

            // Publish an initial state so the dashboard starts with a known value
            mqttClient.publish(TOPIC_STATE,
                               stateToString(confirmedState),
                               true);  // retained
        } else {
            Serial.printf(" failed (rc=%d). Retrying in 5 s…\n",
                           mqttClient.state());
            delay(5000);
        }
    }
}

// =============================================================================
// Arduino entry points
// =============================================================================

void setup() {
    Serial.begin(115200);
    Serial.println("\n=== MEMS — ESP32 Tower-Light Monitor ===\n");

    // Configure tower-light input pins
    pinMode(PIN_GREEN_LIGHT, INPUT);
    pinMode(PIN_RED_LIGHT,   INPUT);

    // Network
    connectWiFi();
    connectMQTT();

    // Initialise debounce tracking
    candidateState = readRawState();
    candidateStart = millis();
}

void loop() {
    // ── Keep MQTT alive / reconnect if dropped ──────────────────────────────
    if (!mqttClient.connected()) {
        connectMQTT();
    }
    mqttClient.loop();

    // ── Read raw tower-light state ──────────────────────────────────────────
    MachineState rawState = readRawState();

    // ── Software debounce logic ─────────────────────────────────────────────
    if (rawState != candidateState) {
        // The reading changed — restart the debounce timer with new candidate
        candidateState = rawState;
        candidateStart = millis();
    } else if (rawState != confirmedState) {
        // The candidate is still stable; check whether the debounce window
        // has elapsed.
        if ((millis() - candidateStart) >= DEBOUNCE_MS) {
            // ── State confirmed — publish if it actually changed ────────────
            confirmedState = rawState;
            const char* payload = stateToString(confirmedState);

            Serial.printf("[STATE] %s  → publishing to %s\n", payload, TOPIC_STATE);
            mqttClient.publish(TOPIC_STATE, payload, true);  // retained
        }
    }

    // Small delay to avoid busy-looping — 50 ms gives ~20 reads / sec
    delay(50);
}
