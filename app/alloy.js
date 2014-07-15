
//
Alloy.Globals.Map = require('ti.map');

// GEO
Titanium.Geolocation.purpose = "Recieve User Location";
Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;

function updateLocation() {
	Titanium.Geolocation.getCurrentPosition(function(e) {
		Ti.API.info(e.coords);
	});
}

Titanium.Geolocation.addEventListener('location', function() {
	updateLocation();
});

updateLocation();
