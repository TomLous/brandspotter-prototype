var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

Alloy.Globals.Map = require("ti.map");

Titanium.Geolocation.purpose = "Recieve User Location";

Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;

Alloy.createController("index");