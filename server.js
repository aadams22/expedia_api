var express    = require('express');
var app        = express();
var airports   = require('airport-codes');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

var flights = [];
var airline = "Delta";


var o  = "DEN";
console.log("O: ",typeof o)
var destination = "DEN";
console.log('D: ',typeof destination);
var dd = "2016-09-20";
console.log('DD: ',typeof dd);

// var url     = "http://terminal2.expedia.com/x/mflights/search?departureAirport=" + o + "&arrivalAirport=" + destination + "&departureDate=" + dd + "&apikey=" + process.env.FLIGHTBOT_EXPEDIA_API_KEY;
var url     = "http://terminal2.expedia.com/x/mflights/search?departureAirport=MSP&arrivalAirport=DEN&departureDate=2016-10-22&apikey=" + process.env.FLIGHTBOT_EXPEDIA_API_KEY;
var method  = 'GET';
var async   = true;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var request = new XMLHttpRequest();


request.onload = function() {
  var status = request.status;
  var data   = JSON.parse(request.responseText);
  console.log("status ", status);

  var d = flightData.filterData(data);
  // console.log(d);
  var s = flights.sort(flightData.sortFlights);
  // console.log(s);
  var p = flightData.removeDuplicates(x => x.flightNumber, s);
  // console.log("THIS IS P:", p);
  console.log(flightData.printF(p));

};

request.open(method, url, async);
request.setRequestHeader("Content-Type", "json;");
request.send();

//==========================================================================
//FUNCTION DEFINITION
//==========================================================================
var conversion = {
    convertCity: function(city) {
    //runs a backbone query on the airport-codes module to find the IATA for user's input city
      return airports.findWhere({ 'city' : city }).get('iata'); 
  },
  removeDate: function(date) {  
    var a = date.split(" ");
    return  a[3].split(":")[0] + ":" + a[3].split(":")[1] + " " + a[4];   
  }
}

var flightData = {
  filterData: function (d) {

      for (var i = 0; i < d.legs.length; i++) {
        console.log(d.legs[i].segments[0].arrivalAirportCode + " : " + destination)
        if(d.legs[i].segments[0].arrivalAirportCode === destination){
          flights.push({
            "flightNumber": d.legs[i].segments[0].flightNumber,
            "departure": d.legs[i].segments[0].departureTime,
            "arrival": d.legs[i].segments[0].arrivalTime,
            "airline": d.legs[i].segments[0].airlineName,
            // "stops": d.legs[i].segments[0].stops,
            "timeEpochSec": d.legs[i].segments[0].departureTimeEpochSeconds,
            "departureAirportCode": d.legs[i].segments[0].departureAirportCode,
            "arrivalAirportCode": d.legs[i].segments[0].arrivalAirportCode
          }); 
        }
      };
      return flights;
    },
  sortFlights: function(a,b) {
    return a.timeEpochSec - b.timeEpochSec;
  },
  removeDuplicates: function(k,a) {
    return a.filter(function(x) {
      var mySet = new Set();

      var key   = k(x); 
      var isNew = !mySet.has(key);

      if (isNew) { return mySet.add(key) };
    });

  },
  printF: function(f) {
    var a = [];
    for (var i = 0; i < f.length; i++) {
            if( airline == f[i].airline ) {
      a.push("Flight Number: " + f[i].flightNumber 
            // + ", Departure: " + f[i].departure
            + ", Arrival: "   + conversion.removeDate(f[i].arrival)
            // + ", Arline: "   + f[i].airline
            // + ", Stops: "      + f[i].stops
            // + ", Departure Airport: "     + f[i].departureAirportCode
            // + ", Arrival Airport: "       + f[i].arrivalAirportCode
            + ". ")}
    };
    // console.log("results: ", a.join(""))
    return a.join("");
  }

};




  app.listen(8080, function(){
    console.log('===========have a cup of tea===========');
  });




