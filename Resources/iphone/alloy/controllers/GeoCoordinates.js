function Controller() {
    function updateDisplayPosition() {
        if (!busyFlagPosition) {
            busyFlagPosition = true;
            managePOILocations();
            displayPOILocations();
            busyFlagPosition = false;
        }
    }
    function updateDisplayOrientation() {
        if (!busyFlagOrientation) {
            busyFlagOrientation = true;
            positionPOILocations();
            busyFlagOrientation = false;
        }
    }
    function positionPOILocations() {
        for (locationId in poiLocationControllers) {
            var poiBearing = poiLocationControllers[locationId].calculateBearing(locationInfo.coords);
            var relativeAngleDegrees = (poiBearing - locationInfo.heading.smoothMagneticHeading + 360) % 360;
            var relativeAngle = geoMath.toRadians(relativeAngleDegrees);
            if (90 > relativeAngleDegrees || relativeAngleDegrees > 270) {
                var delta = geoMath.calculateAngularDeltaFactor(relativeAngle, viewingAngle);
                var poiX = screen.width * delta + screen.center.x;
                poiLocationControllers[locationId].setPosition(poiX, screen.center.y);
            } else poiLocationControllers[locationId].hideView();
        }
    }
    function displayPOILocations() {
        for (locationId in poiLocationControllers) {
            var distance = poiLocationControllers[locationId].getDistance();
            var opacity = ((maxPOIDistance - distance) / (maxPOIDistance * (1 / (1 - minPOIOpacity))) + minPOIOpacity).toFixed(2);
            var scale = ((maxPOIDistance - distance) / (maxPOIDistance * (1 / (1 - minPOIScale))) + minPOIScale).toFixed(2);
            poiLocationControllers[locationId].setAppearance(opacity, scale);
        }
    }
    function managePOILocations() {
        for (locationId in poiLocationControllers) {
            poiLocationControllers[locationId].calculateDistanceAndBearing(locationInfo.coords);
            if (maxPOIDistance > poiLocationControllers[locationId].getDistance()) poiLocationControllers[locationId].resetCounter(); else {
                poiLocationControllers[locationId].incrementCounter();
                if (poiLocationControllers[locationId].getCounter() > maxPOIAgeCounter) {
                    poiLocationControllers[locationId].hideView();
                    $.canvas.remove(poiLocationControllers[locationId].getView());
                    poiLocationControllers[locationId] = null;
                    delete poiLocationControllers[locationId];
                }
            }
        }
        for (locationId in locations) if (!poiLocationControllers[locationId] && locationInfo.coords) {
            locationObj = locations[locationId];
            var distance = geoMath.calculateDistance(locationInfo.coords, locationObj.geoLocation);
            if (maxPOIDistance > distance) {
                var locationController = Alloy.createController("LocationView");
                $.canvas.add(locationController.getView());
                locationController.setLocationData(locationObj);
                locationController.calculateDistanceAndBearing(locationInfo.coords);
                Ti.API.info(locationObj.name + " " + locationInfo.heading.smoothMagneticHeading + " " + locationController.getBearing());
                poiLocationControllers[locationId] = locationController;
            }
        }
    }
    function loadPOIs() {
        var now = Math.round(new Date().getTime() / 1e3);
        if (now - lastTime > minInterval) {
            lastTime = now;
            var postURL = "http://datatools01.appspot.com/v1/DataInterface/GoogleMaps/GoogleMapsPlaces/nearbySearch";
            var xhr = Titanium.Network.createHTTPClient();
            var data = {
                latitude: locationInfo.coords.latitude,
                longitude: locationInfo.coords.longitude,
                types: "establishment",
                follow_pagetoken: 1
            };
            xhr.onload = function() {
                Titanium.API.info("Status: " + this.status);
                var jsonObject = JSON.parse(this.responseText);
                locations = jsonObject.data;
            };
            xhr.onerror = function(e) {
                Titanium.API.error("error: " + e.error);
            };
            xhr.open("POST", postURL);
            xhr.send(data);
        }
    }
    function updateLocation() {
        Titanium.Geolocation.getCurrentPosition(function(e) {
            locationInfo.coords = e.coords;
            $.lat.text = e.coords.latitude;
            $.long.text = e.coords.longitude;
            $.speed.text = e.coords.speed;
            loadPOIs();
        });
    }
    function updateOrientation(orientation) {
        orientation = orientation || Titanium.Gesture.getOrientation();
        locationInfo.orientation = orientation;
        var text = "?  [" + orientation + "]";
        switch (orientation) {
          case Titanium.UI.PORTRAIT:
            text = "PORTRAIT [" + orientation + "]";
            break;

          case Titanium.UI.UPSIDE_PORTRAIT:
            text = "UPSIDE_PORTRAIT [" + orientation + "]";
            break;

          case Titanium.UI.LANDSCAPE_LEFT:
            text = "LANDSCAPE_LEFT [" + orientation + "]";
            break;

          case Titanium.UI.LANDSCAPE_RIGHT:
            text = "LANDSCAPE_RIGHT [" + orientation + "]";
            break;

          case Titanium.UI.FACE_UP:
            text = "FACE_UP [" + orientation + "]";
            break;

          case Titanium.UI.FACE_DOWN:
            text = "FACE_DOWN [" + orientation + "]";
        }
        $.orientation.text = text;
    }
    function updateHeading() {
        Ti.Geolocation.getCurrentHeading(function(e) {
            locationInfo.heading = e.heading;
            locationInfo.heading.smoothMagneticHeading = compassSmoother.smooth(e.heading.magneticHeading);
            $.heading.text = e.heading.smoothMagneticHeading;
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "GeoCoordinates";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.GeoCoordinates = Ti.UI.createView({
        id: "GeoCoordinates"
    });
    $.__views.GeoCoordinates && $.addTopLevelView($.__views.GeoCoordinates);
    $.__views.coordinates = Ti.UI.createView({
        bottom: "10dp",
        width: "90%",
        height: "165dp",
        backgroundColor: "#CCCCCC",
        borderColor: "#FFFFFF",
        borderWidth: "1dp",
        id: "coordinates"
    });
    $.__views.GeoCoordinates.add($.__views.coordinates);
    $.__views.__alloyId0 = Ti.UI.createLabel({
        width: "70dp",
        left: "10dp",
        height: "15dp",
        color: "#000000",
        font: {
            fontSize: "11dp"
        },
        top: "5dp",
        text: "Lat:",
        id: "__alloyId0"
    });
    $.__views.coordinates.add($.__views.__alloyId0);
    $.__views.lat = Ti.UI.createLabel({
        width: "80%",
        left: "90dp",
        color: "#000000",
        height: "15dp",
        font: {
            fontSize: "11dp"
        },
        top: "5dp",
        id: "lat"
    });
    $.__views.coordinates.add($.__views.lat);
    $.__views.__alloyId1 = Ti.UI.createLabel({
        width: "70dp",
        left: "10dp",
        height: "15dp",
        color: "#000000",
        font: {
            fontSize: "11dp"
        },
        top: "25dp",
        text: "Long:",
        id: "__alloyId1"
    });
    $.__views.coordinates.add($.__views.__alloyId1);
    $.__views.long = Ti.UI.createLabel({
        width: "80%",
        left: "90dp",
        color: "#000000",
        height: "15dp",
        font: {
            fontSize: "11dp"
        },
        top: "25dp",
        id: "long"
    });
    $.__views.coordinates.add($.__views.long);
    $.__views.__alloyId2 = Ti.UI.createLabel({
        width: "70dp",
        left: "10dp",
        height: "15dp",
        color: "#000000",
        font: {
            fontSize: "11dp"
        },
        top: "45dp",
        text: "Heading:",
        id: "__alloyId2"
    });
    $.__views.coordinates.add($.__views.__alloyId2);
    $.__views.heading = Ti.UI.createLabel({
        width: "80%",
        left: "90dp",
        color: "#000000",
        height: "15dp",
        font: {
            fontSize: "11dp"
        },
        top: "45dp",
        id: "heading"
    });
    $.__views.coordinates.add($.__views.heading);
    $.__views.__alloyId3 = Ti.UI.createLabel({
        width: "70dp",
        left: "10dp",
        height: "15dp",
        color: "#000000",
        font: {
            fontSize: "11dp"
        },
        top: "65dp",
        text: "Speed:",
        id: "__alloyId3"
    });
    $.__views.coordinates.add($.__views.__alloyId3);
    $.__views.speed = Ti.UI.createLabel({
        width: "80%",
        left: "90dp",
        color: "#000000",
        height: "15dp",
        font: {
            fontSize: "11dp"
        },
        top: "65dp",
        id: "speed"
    });
    $.__views.coordinates.add($.__views.speed);
    $.__views.__alloyId4 = Ti.UI.createLabel({
        width: "70dp",
        left: "10dp",
        height: "15dp",
        color: "#000000",
        font: {
            fontSize: "11dp"
        },
        top: "85dp",
        text: "Orientation:",
        id: "__alloyId4"
    });
    $.__views.coordinates.add($.__views.__alloyId4);
    $.__views.orientation = Ti.UI.createLabel({
        width: "80%",
        left: "90dp",
        color: "#000000",
        height: "15dp",
        font: {
            fontSize: "11dp"
        },
        top: "85dp",
        id: "orientation"
    });
    $.__views.coordinates.add($.__views.orientation);
    $.__views.__alloyId5 = Ti.UI.createLabel({
        width: "70dp",
        left: "10dp",
        height: "15dp",
        color: "#000000",
        font: {
            fontSize: "11dp"
        },
        top: "105dp",
        text: "X:",
        id: "__alloyId5"
    });
    $.__views.coordinates.add($.__views.__alloyId5);
    $.__views.x = Ti.UI.createLabel({
        width: "80%",
        left: "90dp",
        color: "#000000",
        height: "15dp",
        font: {
            fontSize: "11dp"
        },
        top: "105dp",
        id: "x"
    });
    $.__views.coordinates.add($.__views.x);
    $.__views.__alloyId6 = Ti.UI.createLabel({
        width: "70dp",
        left: "10dp",
        height: "15dp",
        color: "#000000",
        font: {
            fontSize: "11dp"
        },
        top: "125dp",
        text: "Y:",
        id: "__alloyId6"
    });
    $.__views.coordinates.add($.__views.__alloyId6);
    $.__views.y = Ti.UI.createLabel({
        width: "80%",
        left: "90dp",
        color: "#000000",
        height: "15dp",
        font: {
            fontSize: "11dp"
        },
        top: "125dp",
        id: "y"
    });
    $.__views.coordinates.add($.__views.y);
    $.__views.__alloyId7 = Ti.UI.createLabel({
        width: "70dp",
        left: "10dp",
        height: "15dp",
        color: "#000000",
        font: {
            fontSize: "11dp"
        },
        top: "145dp",
        text: "Z:",
        id: "__alloyId7"
    });
    $.__views.coordinates.add($.__views.__alloyId7);
    $.__views.z = Ti.UI.createLabel({
        width: "80%",
        left: "90dp",
        color: "#000000",
        height: "15dp",
        font: {
            fontSize: "11dp"
        },
        top: "145dp",
        id: "z"
    });
    $.__views.coordinates.add($.__views.z);
    $.__views.canvas = Ti.UI.createView({
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        layout: "absolute",
        backgroundColor: "transparent",
        id: "canvas"
    });
    $.__views.GeoCoordinates.add($.__views.canvas);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    var geoMath = require("geoMath");
    var CompassSmoother = require("CompassSmoother");
    Titanium.Geolocation.distanceFilter = 10;
    Titanium.Geolocation.headingFilter = .5;
    var compassSmoother = new CompassSmoother(.22);
    var minInterval = 60;
    var lastTime = -1;
    var busyFlagPosition = false;
    var busyFlagOrientation = false;
    var locationInfo = {
        coords: {},
        heading: {},
        orientation: 0,
        accelerometer: {}
    };
    var maxPOIDistance = 900;
    var updateIntervalPosition = 3e3;
    var maxPOIAgeCounter = 5;
    var locations = {};
    var poiLocationControllers = {};
    var minPOIOpacity = .5;
    var minPOIScale = .4;
    var viewingAngleDeg = 35;
    var viewingAngle = geoMath.toRadians(viewingAngleDeg);
    var screen = {
        center: {
            x: Titanium.Platform.displayCaps.platformWidth / 2,
            y: Titanium.Platform.displayCaps.platformHeight / 2
        },
        width: Titanium.Platform.displayCaps.platformWidth,
        height: Titanium.Platform.displayCaps.platformHeight
    };
    Titanium.Geolocation.addEventListener("location", function() {
        updateLocation();
    });
    Titanium.Geolocation.addEventListener("heading", function() {
        updateHeading();
        updateDisplayOrientation();
    });
    Titanium.Gesture.addEventListener("orientationchange", function(e) {
        updateOrientation(e.orientation);
    });
    updateLocation();
    updateHeading();
    updateOrientation();
    setInterval(updateDisplayPosition, updateIntervalPosition);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;