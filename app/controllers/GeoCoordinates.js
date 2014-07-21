var args = arguments[0] || {};

var geoMath = require('geoMath');
var CompassSmoother = require('CompassSmoother');

Titanium.Geolocation.distanceFilter = 10;
Titanium.Geolocation.headingFilter = 0.5;

var compassSmoother = new CompassSmoother(0.22);

// globals
var minInterval =  60; //sec
var lastTime = -1;

var busyFlagPosition = false;
var busyFlagOrientation = false;


var locationInfo = {
	coords: {},
	heading: {},
	orientation: 0,
	accelerometer: {}
};

var maxPOIDistance = 900; // meters
var updateIntervalOrientation = 100;
var updateIntervalPosition = 3000;
var maxPOIAgeCounter = 5;
var locations = {};
var poiLocationControllers = {};

var minPOIOpacity = 0.5;
var minPOIScale = 0.4;

var viewingAngleDeg = 35; 
var viewingAngle = geoMath.toRadians(viewingAngleDeg); 

var screen = {
		center : {
			x: Titanium.Platform.displayCaps.platformWidth/2, 
			y: Titanium.Platform.displayCaps.platformHeight/2
		},
		width: Titanium.Platform.displayCaps.platformWidth,
		height: Titanium.Platform.displayCaps.platformHeight
};
		
// update/create views


function updateDisplayPosition(){
	if(!busyFlagPosition){
		busyFlagPosition = true;
		
		managePOILocations();
		
		displayPOILocations();
			
		
		busyFlagPosition = false;
	}	
}

function updateDisplayOrientation(){
	if(!busyFlagOrientation){
		busyFlagOrientation = true;
		
		
		positionPOILocations();
		
		
		busyFlagOrientation = false;
	}
	
}

function positionPOILocations(){
	// var currentBearing = locationInfo.heading.magneticHeading;
	var poiLocationControllersOnScreen = {};
	
	for(locationId in poiLocationControllers){
		var poiBearing = poiLocationControllers[locationId].calculateBearing(locationInfo.coords);
		var relativeAngleDegrees = (poiBearing - locationInfo.heading.smoothMagneticHeading  + 360) % 360;
		var relativeAngle  = geoMath.toRadians(relativeAngleDegrees);
		
		// Ti.API.info(locationId + ' - ' +poiBearing+ ' - ' + relativeAngleDegrees);
		
		if(relativeAngleDegrees < 90 || relativeAngleDegrees > 270){
			
			var delta = geoMath.calculateAngularDeltaFactor(relativeAngle,viewingAngle);
			var poiX = (screen.width * delta) + screen.center.x;
			
			poiLocationControllers[locationId].setPosition(poiX, screen.center.y);	
			
		}else{
			poiLocationControllers[locationId].hideView();
		}
		
		
				
	
	}
}



function displayPOILocations(){
	for(locationId in poiLocationControllers){
		
		var distance = poiLocationControllers[locationId].getDistance();
		var opacity = (((maxPOIDistance - distance) / ( maxPOIDistance * (1 / (1-minPOIOpacity)))) + minPOIOpacity).toFixed(2);
		var scale =  (((maxPOIDistance - distance) / ( maxPOIDistance * (1 / (1-minPOIScale)))) + minPOIScale).toFixed(2);
		
		
		poiLocationControllers[locationId].setAppearance(opacity, scale);
	}
}


function managePOILocations(){
	// recalculate distances & reset/increment counters for POI's. Remove old ones
	for(locationId in poiLocationControllers){
		poiLocationControllers[locationId].calculateDistanceAndBearing(locationInfo.coords);
		
		if(poiLocationControllers[locationId].getDistance() < maxPOIDistance){
			poiLocationControllers[locationId].resetCounter();
		}else{
			poiLocationControllers[locationId].incrementCounter();
			if(poiLocationControllers[locationId].getCounter() > maxPOIAgeCounter){
				poiLocationControllers[locationId].hideView();
				$.canvas.remove(poiLocationControllers[locationId].getView());
				poiLocationControllers[locationId] = null;
				delete poiLocationControllers[locationId];
			}
		}
	} 
	
	// add locations within range
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
				locationController.calculateDistanceAndBearing(locationInfo.coords);
				
				Ti.API.info(locationObj.name + ' ' + locationInfo.heading.smoothMagneticHeading + ' ' + locationController.getBearing());
				
				poiLocationControllers[locationId] = locationController;
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
        locationInfo.heading.smoothMagneticHeading = compassSmoother.smooth(e.heading.magneticHeading);
		
		$.heading.text = e.heading.smoothMagneticHeading;		
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
	updateDisplayOrientation();	
});

Titanium.Gesture.addEventListener("orientationchange", function(e){
	updateOrientation(e.orientation);
	// updateDisplayOrientation();
});

// Titanium.Accelerometer.addEventListener('update', function(e){
	// updateAccelerometer(e);
// });




updateLocation();
updateHeading();
updateOrientation();
setInterval(updateDisplayPosition, updateIntervalPosition);
// setInterval(updateDisplayOrientation, updateDisplayOrientation);
