function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "camera";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.camera = Ti.UI.createView({
        id: "camera"
    });
    $.__views.camera && $.addTopLevelView($.__views.camera);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    Ti.Media.showCamera({
        success: function() {},
        cancel: function() {},
        error: function() {},
        mediaTypes: [ Ti.Media.MEDIA_TYPE_VIDEO, Ti.Media.MEDIA_TYPE_PHOTO ],
        showControls: false,
        autohide: false,
        autofocus: "off",
        animated: false
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;