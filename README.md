# Analog to digital temperature converter.

The goal is receive a data from a temperature sensor conneted to Arduno board by analog input. And by serial port transfer a data to computer for future analysis and visualisation.

## Used tehcnologies.

Temperature sensor is TMP36.
Arduino UNO.
MongoDB to storage a data.
Web and dygraphs to visualisation a data.

## Calculating

One document safe one minute in seconds.  
One full document equal to 905 bytes.  
Therefore one hour will be 54300 bytes.  
Therefore one day will be 1303200 bytes.  
And one month will be 39096000 bytes.  
That equal to 37.28Mb per Month.  
And 447.36Mb per Year.  
And 4.37Gb per 10 Years.   

## Export average temperature per minute to CSV

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

mongoexport -d metrics -c export -f day,avgTotal --type=csv --out=temperatres.csv
```

