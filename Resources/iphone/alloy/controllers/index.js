function Controller() {
    function openCamera() {
        var cameraScaleFactor = 1.7;
        var geoCoordinatesController = Alloy.createController("GeoCoordinates");
        Ti.Media.showCamera({
            success: function() {},
            cancel: function() {},
            error: function() {},
            mediaTypes: [ Ti.Media.MEDIA_TYPE_VIDEO, Ti.Media.MEDIA_TYPE_PHOTO ],
            showControls: false,
            autohide: false,
            autofocus: "off",
            animated: false,
            overlay: geoCoordinatesController.getView(),
            transform: Titanium.UI.create2DMatrix().translate(0, 0).scale(cameraScaleFactor)
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "white",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.label = Ti.UI.createLabel({
        width: Ti.UI.SIZE,
        height: Ti.UI.SIZE,
        color: "#000",
        text: "Open Camera",
        id: "label"
    });
    $.__views.index.add($.__views.label);
    openCamera ? $.__views.label.addEventListener("click", openCamera) : __defers["$.__views.label!click!openCamera"] = true;
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.index.open();
    __defers["$.__views.label!click!openCamera"] && $.__views.label.addEventListener("click", openCamera);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;