var args = arguments[0] || {};

var geoMath = require('geoMath');

var locationData = null;
var counter = 0;


exports.setLocationData = function(_locationData){
	locationData = _locationData;
	$.name.text = locationData.name;
};


exports.calculateDistance = function(point1){
	return geoMath.calculateDistance(point1, locationData.geoLocation);
};

// Counter logic
exports.incrementCounter = function(){
	counter++;	
};

exports.getCounter = function(){
	return counter; 
};

exports.resetCounter = function(){
	counter = 0; 
};

