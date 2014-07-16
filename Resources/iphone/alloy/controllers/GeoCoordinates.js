function Controller() {
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
    function updateHeading() {
        Ti.Geolocation.getCurrentHeading(function(e) {
            Ti.API.info(e.heading);
            $.heading.text = e.heading.trueHeading;
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
        height: "150dp",
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
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    Titanium.Geolocation.addEventListener("location", function() {
        updateLocation();
    });
    Titanium.Geolocation.addEventListener("heading", function() {
        updateHeading();
    });
    Ti.Gesture.addEventListener("orientationchange", function(e) {
        updateOrientation(e.orientation);
    });
    updateLocation();
    updateHeading();
    updateOrientation();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;