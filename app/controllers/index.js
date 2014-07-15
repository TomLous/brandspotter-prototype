

function openCamera(e) {
	var cameraScaleFactor = 1.7;
	Ti.Media.showCamera({
		success : function(event) {
		},
		cancel : function() {
		},
		error : function(error) {
		},
		mediaTypes : [Ti.Media.MEDIA_TYPE_VIDEO, Ti.Media.MEDIA_TYPE_PHOTO],
		showControls : false,
		autohide : false,
		autofocus : "off",
		animated : false,
		transform : Titanium.UI.create2DMatrix().translate(0, 0).scale(cameraScaleFactor)
	});
}



$.index.open();
