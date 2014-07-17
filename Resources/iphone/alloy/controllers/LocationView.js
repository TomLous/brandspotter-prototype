function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "LocationView";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.LocationView = Ti.UI.createView({
        width: "200dp",
        height: "60dp",
        backgroundColor: "#0099FF",
        borderColor: "#0033CC",
        borderWidth: "1dp",
        id: "LocationView"
    });
    $.__views.LocationView && $.addTopLevelView($.__views.LocationView);
    $.__views.name = Ti.UI.createLabel({
        width: "190dp",
        left: "5dp",
        height: "14dp",
        color: "#FFFFFF",
        font: {
            fontSize: "13dp"
        },
        id: "name"
    });
    $.__views.LocationView.add($.__views.name);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    Ti.API.info(1);
    var geoMath = require("geoMath");
    Ti.API.info(2);
    var locationData = null;
    var counter = 0;
    Ti.API.info(3);
    exports.setLocationData = function(_locationData) {
        Ti.API.info(4);
        locationData = _locationData;
        Ti.API.info(5);
        $.name.text = locationData.name;
        Ti.API.info(6);
    };
    exports.calculateDistance = function(point1) {
        return geoMath.calculateDistance(point1, locationData.geoLocation);
    };
    exports.incrementCounter = function() {
        counter++;
    };
    exports.getCounter = function() {
        return counter;
    };
    exports.resetCounter = function() {
        counter = 0;
    };
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;