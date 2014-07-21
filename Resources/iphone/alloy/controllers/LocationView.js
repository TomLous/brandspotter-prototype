function Controller() {
    function setLocationData(_locationData) {
        locationData = _locationData;
        $.name.text = locationData.name;
        $.marquee.center = {
            x: 200,
            y: -100
        };
    }
    function setDistance(_currentDistance) {
        currentDistance = _currentDistance;
        $.distance.text = currentDistance.toFixed(1) + "m";
    }
    function setBearing(_currentBearing) {
        currentBearing = _currentBearing;
    }
    function getDistance() {
        return currentDistance;
    }
    function getBearing() {
        return currentBearing;
    }
    function isOnScreen() {
        return true;
    }
    function setAppearance(_opacity, _scale) {
        $.marquee.opacity = _opacity;
        $.marquee.zIndex = Math.round(10 * currentDistance);
        if (_scale > 0 && _scale != scale) {
            var ts = Ti.UI.create2DMatrix().scale(_scale);
            $.marquee.scale = _scale;
            $.marquee.transform = ts;
            scale = _scale;
        }
    }
    function calculateDistanceAndBearing(point1) {
        var distance = calculateDistance(point1);
        calculateBearing(point1);
        return distance;
    }
    function calculateDistance(point1) {
        var distance = geoMath.calculateDistance(point1, locationData.geoLocation);
        setDistance(distance);
        return distance;
    }
    function calculateBearing(point1) {
        var bearing = geoMath.calculateBearing(point1, locationData.geoLocation);
        setBearing(bearing);
        return bearing;
    }
    function setPosition(x, y) {
        yOffset = (500 - currentDistance) / 3;
        $.marquee.center = {
            x: x,
            y: y + yOffset - 100
        };
        $.marquee.show();
    }
    function hideView() {
        $.marquee.hide();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "LocationView";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.marquee = Ti.UI.createView({
        width: "200dp",
        height: "60dp",
        backgroundColor: "#0099FF",
        borderColor: "#0033CC",
        borderWidth: "1dp",
        id: "marquee",
        visible: "false"
    });
    $.__views.marquee && $.addTopLevelView($.__views.marquee);
    $.__views.name = Ti.UI.createLabel({
        width: "190dp",
        left: "5dp",
        height: "14dp",
        color: "#FFFFFF",
        font: {
            fontSize: "13dp"
        },
        top: "5dp",
        id: "name"
    });
    $.__views.marquee.add($.__views.name);
    $.__views.distance = Ti.UI.createLabel({
        width: "190dp",
        left: "5dp",
        height: "14dp",
        color: "#CCCCCC",
        font: {
            fontSize: "11dp"
        },
        top: "20dp",
        id: "distance"
    });
    $.__views.marquee.add($.__views.distance);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    var geoMath = require("geoMath");
    var locationData = null;
    var currentDistance = -1;
    var currentBearing = -1;
    var counter = 0;
    var scale = 1;
    exports.data = locationData;
    exports.setLocationData = setLocationData;
    exports.setDistance = setDistance;
    exports.setBearing = setBearing;
    exports.getDistance = getDistance;
    exports.getBearing = getBearing;
    exports.isOnScreen = isOnScreen;
    exports.setAppearance = setAppearance;
    exports.calculateDistanceAndBearing = calculateDistanceAndBearing;
    exports.calculateDistance = calculateDistance;
    exports.calculateBearing = calculateBearing;
    exports.setPosition = setPosition;
    exports.hideView = hideView;
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