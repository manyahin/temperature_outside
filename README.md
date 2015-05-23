# Analog to digital temperature converter

The goal is receive a data from a temperature sensor conneted to Arduno board by analog input. And by UART interface transfer a data to computer for future analysis and visualisation.

![Graph Screenshot](https://raw.githubusercontent.com/manyahin/temperature_outside/master/graph/graph_vision.png)

## Used tehcnologies

Temperature sensor is TMP36.
Board is Arduino UNO.
MongoDB for storage the data.
Dygraphs to visualisation the data.

## Calculating

One document contain one minute in seconds.
One document equal 905 bytes (~1Kb).
One hour is 60Kb.  
One day is 1440Kb (~1.4Mb).  
One month is 39096Kb.    
One year is 447.36Mb.  
10 years is 4.37Gb.   

## Export average temperature per minute to CSV file from MongoDB.

```javascript
db.temperatures.aggregate([
	{ 
		$project: {
			_id: false,
			day: { $dateToString: { format: "%Y-%m-%d  %H:%M", date: "$timestamp" } },
			avgTotal: { $divide : [ "$total_samples" , "$num_samples" ] } 
		} 
	},
	{
		$out: "export"
	}
])

mongoexport -d metrics -c export -f day,avgTotal --type=csv --out=temperatures.csv
```

## Visualisation a data
```
cd graph
npm install
node server
```
Open (http://127.0.0.1:8080/)[http://127.0.0.1:8080/] in your browser.

