#include <HardwareSerial.h>
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <TinyGPS++.h>

// Bluetooth
#define SERVICE_UUID "d684998b-a18d-4858-8840-9f388662ee3e"
#define CHARACTERISTIC_UUID "d684998b-a18d-4858-8840-9f388662ee3e"

BLEServer* pServer = NULL;
BLECharacteristic* pCharacteristic = NULL;
bool deviceConnected = false;

TinyGPSPlus GPS;
HardwareSerial CAMSerial(0);
HardwareSerial GPSSerial(2);

String coordinates = "";
String statusCAM = "";

class MyServerCallbacks : public BLEServerCallbacks {
  void onConnect(BLEServer* pServer) {
    deviceConnected = true;
    Serial.println("Device CONNECTED!");
  }

  void onDisconnect(BLEServer* pServer) {
    statusCAM = "";
    Serial.println("Device DISCONNECTED!");
    pServer->startAdvertising();
  }
};

class MyCallbacks : public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic* pCharacteristic) {
    std::string value = pCharacteristic->getValue();
    String receivedData = value.c_str();

    int delimiterIndex = receivedData.indexOf(';');

    if (delimiterIndex != -1) {
      CAMSerial.println(receivedData);
    }
  }
};

void setup() {
  Serial.begin(115200);
  CAMSerial.begin(115200);
  GPSSerial.begin(9600);

  handleBluetooth();
}

void loop() {
  if (Serial.available() > 0) {
    String receivedData = Serial.readStringUntil('\n');
    // Serial.println(receivedData);

    int delimiterIndex = receivedData.indexOf(';');

    if (delimiterIndex != -1) {
      statusCAM = receivedData.substring(delimiterIndex + 1);
      statusCAM.trim();

      Serial.println(statusCAM);
      pCharacteristic->setValue(statusCAM.c_str());
      pCharacteristic->notify();
    }
  }

  while (GPSSerial.available() > 0) {
    GPS.encode(GPSSerial.read());

    if (GPS.location.isUpdated()) {
      coordinates = String(GPS.location.lat(), 5) + "," + String(GPS.location.lng(), 5);
      Serial.println(coordinates);
    }
  }

  if (deviceConnected && coordinates.length() > 0) {
    if (statusCAM != "" && statusCAM != "invalid_credentials") {
      pCharacteristic->setValue(coordinates.c_str());
      pCharacteristic->notify();
      coordinates = "";
    }
  }

  delay(1000);
}

void handleBluetooth() {
  BLEDevice::init("ESP32_BLE");
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  BLEService* pService = pServer->createService(SERVICE_UUID);

  pCharacteristic = pService->createCharacteristic(
    CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_NOTIFY);

  pCharacteristic->setCallbacks(new MyCallbacks());
  pCharacteristic->setValue("");

  pService->start();
  pServer->getAdvertising()->start();
}
