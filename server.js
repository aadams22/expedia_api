var express    = require('express');
var app			   = express();
var airports   = require('airport-codes');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

var flights	= [];

var airline = "Delta";

var conversion = {
		convertCity: function(city) {
		//runs a backbone query on the airport-codes module to find the IATA for user's input city
			return airports.findWhere({ 'city' : city }).get('iata'); 
	}
}

var flightData = {
	findDepartures: function (data) {
			for (var i = 0; i < data.legs.length; i++) {
				flights.push({
					"flightNumber": data.legs[i].segments[0].flightNumber,
					// "departure": data.legs[i].segments[0].departureTime,
					// "arrival": data.legs[i].segments[0].arrivalTime,
					// "airline": data.legs[i].segments[0].airlineName,
					// "stops": data.legs[i].segments[0].stops,
					"timeEpochSec": data.legs[i].segments[0].departureTimeEpochSeconds
				});

			};
			return flights;
		},
	sortFlights: function(a,b) {
		return a.timeEpochSec - b.timeEpochSec;
	},
	removeDuplicates: function(a) {
		console.log(a[0].flightNumber);
    var seen = {};

    return a.filter(function(item.flightNumber) {
    	  console.log("this is seen : ", seen);
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });

	},
	printF: function(f) {
		var a = [];
		for (var i = 0; i < f.length; i++) {
						if( airline == f[i].airline ) {
			a.push("Flight Number: " + f[i].flightNumber 
						+ ", Departure: " + f[i].departure
						// + ", Arrival: "   + f[i].arrival
						// + ", Arline: "		+ f[i].airline
						// + ", Stops: "			+ f[i].stops
						+ ". ")}
		};
		// console.log("results: ", a.join(""))
		return a.join("");
	}

};



var url     = "http://terminal2.expedia.com/x/mflights/search?departureAirport=MSP&arrivalAirport=DEN&departureDate=2016-10-22&apikey=" + process.env.FLIGHTBOT_EXPEDIA_API_KEY;
var method  = 'GET';
var async   = true;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var request = new XMLHttpRequest();


request.onload = function() {
	var status = request.status;
	var data = JSON.parse(request.responseText);
	console.log("status ", status);

	var d = flightData.findDepartures(data);
	// console.log(d);
	var s = flights.sort(flightData.sortFlights);
	// console.log(s);
	var p = flightData.removeDuplicates(s);
	console.log(p);
	// flightData.printF(p);

};

request.open(method, url, async);
request.setRequestHeader("Content-Type", "json;");
request.send();







	app.listen(8080, function(){
		console.log('===========have a cup of tea===========');
	});




