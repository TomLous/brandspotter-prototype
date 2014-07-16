var args = arguments[0] || {};



// Location & Orientation
function updateLocation() {
	Titanium.Geolocation.getCurrentPosition(function(e) {
		Ti.API.info(e.coords);
		$.lat.text = e.coords.latitude;
		$.long.text = e.coords.longitude;		
		$.speed.text = e.coords.speed;
	});
}


function updateOrientation(orientation) {
	orientation = orientation || Titanium.Gesture.getOrientation();
	Ti.API.info(orientation);
    $.orientation.text = orientation;
}

function updateHeading(){
	Ti.Geolocation.getCurrentHeading(function(e) {
        Ti.API.info(e.heading);	
		$.heading.text = e.heading.trueHeading;		
    });
}

Titanium.Geolocation.addEventListener('location', function(e) {
	updateLocation();
});

Titanium.Geolocation.addEventListener('heading', function(e) {
	updateHeading();
});

Ti.Gesture.addEventListener("orientationchange", function(e){
	updateOrientation(e.orientation);
});


updateLocation();
updateHeading();
updateOrientation();
