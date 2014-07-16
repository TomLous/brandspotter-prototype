var args = arguments[0] || {};

Titanium.Geolocation.distanceFilter = 10;
Titanium.Geolocation.headingFilter = 0.2;


// globals
var minInterval =  60; //sec
var lastTime = -1;

var busyFlag = false;


var locationInfo = {
	coords: {},
	heading: {},
	orientation: 0,
	accelerometer: {}
};

var poiMaxDistance = 500; // meters
var updateInterval = 1000;
var locations = {};
var poiViews = {};
// update/create views


function updateDisplay(){
	if(!busyFlag){
		busyFlag = true;
		
		managePOIViews();
		
		
		busyFlag = false;
	}
	
}




function managePOIViews(){
	for(locationId in locations){
		if(!poiViews[locationId] && locationInfo.coords){
			locationObj = locations[locationId];
			//Ti.API.info(locationObj.geoLocation);
			//Ti.API.info(locationInfo.coords);
			var distance = calculateDistance(locationInfo.coords, locationObj.geoLocation);
			if(distance < poiMaxDistance){
				Ti.API.info(locationObj.name + ' ' + distance);
				
				// create / animate views
			}
			
		}
	}
}


// load POI's
function loadPOIs(){
	var now = Math.round(new Date().getTime() / 1000);
	
	// @todo check also distance covered, but for now ok
	if(now - lastTime > minInterval){
		lastTime = now;
		
		var postURL = 'http://datatools01.appspot.com/v1/DataInterface/GoogleMaps/GoogleMapsPlaces/nearbySearch';
		
		var xhr = Titanium.Network.createHTTPClient();
	    
	    var data = {
	        'latitude' : locationInfo.coords.latitude,
	        'longitude' : locationInfo.coords.longitude,
	        'types' : 'establishment',
	    };     
	   
	    xhr.onload = function() {
	        Titanium.API.info('Status: ' + this.status);
	        var jsonObject = JSON.parse(this.responseText);
	        locations = jsonObject.data;
	    };
	    xhr.onerror = function(e) {	        
	        Titanium.API.error('error: '+e.error);
	    };
	 
		xhr.open('POST',postURL);
		 
		xhr.send(data);
	}
		
}

// calculation
//Conversion of Degress to Radians
function toRadians(deg) {
	return deg * Math.PI/180;
}

//Conversion of Radians to Degrees
function toDegrees(rad) {
	return ((rad * 180/Math.PI) + 360) % 360;
}

//Reference for the functions below http://www.movable-type.co.uk/scripts/latlong.html
function calculateDistance(point1, point2) {
    var R = 6371; // km
    
   var φ1 = toRadians(point1.latitude);
    var φ2 = toRadians(point2.latitude);
    
    var λ1 = toRadians(point1.longitude);
    var λ2 = toRadians(point2.longitude);
    
    var Δφ = toRadians(point2.latitude - point1.latitude);
    var Δλ = toRadians(point2.longitude - point1.longitude); 
    
    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
	        Math.cos(φ1) * Math.cos(φ2) *
	        Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	
	var d = R * c * 1000;
    return d;
}


function calculateBearing(point1, point2){
	
	var φ1 = toRadians(point1.latitude);
    var φ2 = toRadians(point2.latitude);
    
    var λ1 = toRadians(point1.longitude);
    var λ2 = toRadians(point2.longitude);
    
    var Δφ = toRadians(point2.latitude - point1.latitude);
    var Δλ = toRadians(point2.longitude - point1.longitude); 
	
	var y = Math.sin(λ2-λ1) * Math.cos(φ2);
	var x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2-λ1);
        
	var bearing = toDegrees(Math.atan2(y, x));
	
	return bearing;
}



//compute the X displacement from the center of the screen given
//the relative horizontal angle of a POI
function computeXDelta(relAngle) {
    var res = Math.sin(relAngle) / Math.sin(viewAngleX /2);
    return res;
}


// Location & Orientation
function updateLocation() {
	Titanium.Geolocation.getCurrentPosition(function(e) {
		// Ti.API.info(e.coords);
		
		locationInfo.coords = e.coords;
		
		$.lat.text = e.coords.latitude;
		$.long.text = e.coords.longitude;		
		$.speed.text = e.coords.speed;
		
		loadPOIs();
	});
}


function updateOrientation(orientation) {
	orientation = orientation || Titanium.Gesture.getOrientation();
	// Ti.API.info(orientation);
	
	locationInfo.orientation = orientation;
		
	
	var text = '?  [' + orientation + ']';
	switch(orientation){
		case  Titanium.UI.PORTRAIT:
			text = 'PORTRAIT [' + orientation + ']' ;
			break;
		case  Titanium.UI.UPSIDE_PORTRAIT:
			text = 'UPSIDE_PORTRAIT [' + orientation + ']' ;
			break;
		case  Titanium.UI.LANDSCAPE_LEFT:
			text = 'LANDSCAPE_LEFT [' + orientation + ']' ;
			break;
		case  Titanium.UI.LANDSCAPE_RIGHT:
			text = 'LANDSCAPE_RIGHT [' + orientation + ']' ;
			break;
		case  Titanium.UI.FACE_UP:
			text = 'FACE_UP [' + orientation + ']' ;
			break;
		case  Titanium.UI.FACE_DOWN:
			text = 'FACE_DOWN [' + orientation + ']' ;
			break;		
	}
    $.orientation.text = text;
}

function updateHeading(){
	Ti.Geolocation.getCurrentHeading(function(e) {
        // Ti.API.info(e.heading);	
        
        locationInfo.heading = e.heading;
		
		$.heading.text = e.heading.trueHeading;		
    });
}

function updateAccelerometer(e){
	// Ti.API.info(e);
	locationInfo.accelerometer = e;
	$.x.text = e.x;	
	$.y.text = e.y;	
	$.z.text = e.z;	
}

Titanium.Geolocation.addEventListener('location', function(e) {
	updateLocation();
});

Titanium.Geolocation.addEventListener('heading', function(e) {
	updateHeading();
});

Titanium.Gesture.addEventListener("orientationchange", function(e){
	updateOrientation(e.orientation);
});

Titanium.Accelerometer.addEventListener('update', function(e){
	updateAccelerometer(e);
});




updateLocation();
updateHeading();
updateOrientation();
setInterval(updateDisplay, updateInterval);
