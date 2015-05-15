var serialport = require("serialport")
var SerialPort = serialport.SerialPort;

var serialArduinoPort = new SerialPort("/dev/cu.usbmodemfd121", {
  baudrate: 9600,
  parser: serialport.parsers.readline("\n")
});

serialArduinoPort.on("open", function () {
  console.log('Succesfulluy connectd to Arduino serial port');

  serialArduinoPort.on('data', function(data) {
    console.log('Current Temperature: ' + data);
  });
});
