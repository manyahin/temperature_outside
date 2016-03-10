var serialport = require("serialport")
var SerialPort = serialport.SerialPort;

var serialArduinoPort = new SerialPort("/dev/ttyACM0", {
  baudrate: 9600,
  parser: serialport.parsers.readline("\n")
});

var MongoClient = require('mongodb').MongoClient;
var collection = null;

MongoClient.connect("mongodb://localhost:27017/metrics", function(err, db) {
  if (err) { return console.dir(err); }

  console.log('Succesfulluy connected to MongoDB');

  collection = db.collection('temperatures');
});

serialArduinoPort.on("open", function () {
	console.log('Succesfulluy connected to Arduino serial port');

  serialArduinoPort.on('data', function(data) {
  	var rcv = data.trim();
	var start = rcv.indexOf('>');
	var end = rcv.indexOf('<');

	if (start != -1 && end != -1) 
	{
		var temperature = parseFloat(rcv.substr(start + 1, end - 1));
	}

	if (!temperature) return;

  	// Wait for database.
  	if (collection === null) return;

    console.log('Received Temperature: ' + temperature);

    // Current second. 
    var second = new Date().getSeconds();

    // Generate rule for update.
    var key_name_second = "values." + second; 
    var updated_value = {};
    updated_value[key_name_second] = temperature;

    // Update/Insert new value to database.
    collection.update({
  		timestamp : getTimestamp()
  	}, {
  		$set : updated_value,
  		$inc : { num_samples: 1, total_samples: temperature }
  	}, {
  		upsert : true
  	});

  });

});

// Function return current date except of seconds. 
function getTimestamp() {
	var currentDate = new Date();

	var generatedDate = new Date(
		currentDate.getFullYear(), 
		currentDate.getMonth(),
		currentDate.getDate(),
		currentDate.getHours() + 2, // Fix time zone.
		currentDate.getMinutes()
	);

	return generatedDate;
}
