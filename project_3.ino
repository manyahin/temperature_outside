const int sensorPin = A0;
const float baselineTemp = 20.0;

void setup() {
  Serial.begin(9600);
   
  for (int pinNumber =2; pinNumber<5; pinNumber++) {
   pinMode(pinNumber, OUTPUT);
   digitalWrite(pinNumber, LOW);
  }   
}

void loop() {
  int sensorVal = analogRead(sensorPin);
//  Serial.print("Sensor value: ");
//   Serial.print(sensorVal);
//  
  float voltage = (sensorVal / 1024.0) * 5.0;
//  Serial.print(", Volts: ");
//  Serial.print(voltage);
//  Serial.print(", degrees C: ");
  float temperature = (voltage - .5) * 100;
  Serial.println(temperature);

  delay(1000);
}
