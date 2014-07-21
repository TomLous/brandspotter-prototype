var args = arguments[0] || {};

var geoMath = require('geoMath');

var locationData = null;
var currentDistance = -1;
var currentBearing = -1;
var counter = 0;
var scale = 1;

exports.data = locationData;


function setLocationData(_locationData){
	locationData = _locationData;
	$.name.text = locationData.name;	
	$.marquee.center = {x: 200, y: -100};
};
exports.setLocationData = setLocationData;



function setDistance(_currentDistance){
	currentDistance = _currentDistance;
	$.distance.text = currentDistance.toFixed(1) + 'm';	
};
exports.setDistance = setDistance;

function setBearing(_currentBearing){
	currentBearing = _currentBearing;
};
exports.setBearing = setBearing;

function getDistance(){
	return currentDistance;
};
exports.getDistance = getDistance;

function getBearing(){
	return currentBearing;
};
exports.getBearing = getBearing;

function isOnScreen(){
	return true;
};
exports.isOnScreen = isOnScreen;




function setAppearance(_opacity, _scale){
	$.marquee.opacity = _opacity;
	$.marquee.zIndex = Math.round(currentDistance * 10);
	if(_scale > 0){
		// _scale = _scale.toFixed(2);
		if(_scale != scale){
			var ts = Ti.UI.create2DMatrix().scale(_scale);
			$.marquee.scale = _scale;
			$.marquee.transform = ts;
			scale = _scale;
		}
	}
};
exports.setAppearance = setAppearance;


function calculateDistanceAndBearing(point1){
	var distance = calculateDistance(point1);
	calculateBearing(point1);
	return distance;
};
exports.calculateDistanceAndBearing = calculateDistanceAndBearing;

function calculateDistance(point1){
	var distance =  geoMath.calculateDistance(point1, locationData.geoLocation);
	setDistance(distance);	
	return distance;
};
exports.calculateDistance = calculateDistance;

function calculateBearing(point1){
	var bearing =  geoMath.calculateBearing(point1, locationData.geoLocation);
	setBearing(bearing);
	return bearing;
};
exports.calculateBearing = calculateBearing;

function setPosition(x, y){
	yOffset = (500 - currentDistance) / 3;
	$.marquee.center = {x: x, y: y+yOffset-100};	
	$.marquee.show();
}
exports.setPosition = setPosition;

function hideView(){		
	$.marquee.hide();
}
exports.hideView = hideView;


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

