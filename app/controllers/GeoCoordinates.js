var args = arguments[0] || {};

var geoMath = require('geoMath');

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

var maxPOIDistance = 500; // meters
var updateInterval = 1000;
var maxPOIAgeCounter = 5;
var locations = {};
var poiLocationControllers = {};
// update/create views


function updateDisplay(){
	if(!busyFlag){
		busyFlag = true;
		
		managePOILocations();
		
		
		busyFlag = false;
	}
	
}




function managePOILocations(){
	for(locationId in poiLocationControllers){
		poiLocationControllers[locationId].incrementCounter();
	} 
	
	for(locationId in locations){
		if(!poiLocationControllers[locationId] && locationInfo.coords){
			locationObj = locations[locationId];
			//Ti.API.info(locationObj.geoLocation);
			//Ti.API.info(locationInfo.coords);
			var distance = geoMath.calculateDistance(locationInfo.coords, locationObj.geoLocation);
			if(distance < maxPOIDistance){
				var locationController = Alloy.createController("LocationView");
				$.canvas.add(locationController.getView());
				locationController.setLocationData(locationObj);
				poiLocationControllers[locationId] = locationController;
			}
			
		}else{
			if(poiLocationControllers[locationId].calculateDistance(locationInfo.coords) < maxPOIDistance){
				poiLocationControllers[locationId].resetCounter();
			}
		}
	}
	
	for(locationId in poiLocationControllers){
		if(poiLocationControllers[locationId].getCounter() > maxPOIAgeCounter){
			$.canvas.remove(poiLocationControllers[locationId].getView());
			poiLocationControllers[locationId] = null;
			delete poiLocationControllers[locationId];
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
	        'follow_pagetoken' : 1,
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
