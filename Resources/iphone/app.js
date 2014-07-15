function updateLocation() {
    Titanium.Geolocation.getCurrentPosition(function(e) {
        Ti.API.info(e.coords);
    });
}

var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

Alloy.Globals.Map = require("ti.map");

Titanium.Geolocation.purpose = "Recieve User Location";

Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;

Titanium.Geolocation.addEventListener("location", function() {
    updateLocation();
});

updateLocation();

Alloy.createController("index");