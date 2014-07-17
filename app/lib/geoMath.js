// calculation
//Conversion of Degress to Radians
function toRadians(deg) {
	return deg * Math.PI/180;
}
exports.toRadians = toRadians;

//Conversion of Radians to Degrees
function toDegrees(rad) {
	return ((rad * 180/Math.PI) + 360) % 360;
}
exports.toDegrees = toDegrees;

//Reference for the functions below http://www.movable-type.co.uk/scripts/latlong.html
function calculateDistance(point1, point2) {
    var R = 6371; // km
    
  	var φ1 = toRadians(point1.latitude);
    var φ2 = toRadians(point2.latitude);
    
    var λ1 = toRadians(point1.longitude);
    var λ2 = toRadians(point2.longitude);
    
    var Δφ = toRadians(point2.latitude - point1.latitude);
    var Δλ = toRadians(point2.longitude - point1.longitude); 
    
    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
	        Math.cos(φ1) * Math.cos(φ2) *
	        Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	
	var d = R * c * 1000;
    return d;
}
exports.calculateDistance = calculateDistance;

function calculateBearing(point1, point2){
	
	var φ1 = toRadians(point1.latitude);
    var φ2 = toRadians(point2.latitude);
    
    var λ1 = toRadians(point1.longitude);
    var λ2 = toRadians(point2.longitude);
    
    var Δφ = toRadians(point2.latitude - point1.latitude);
    var Δλ = toRadians(point2.longitude - point1.longitude); 
	
	var y = Math.sin(λ2-λ1) * Math.cos(φ2);
	var x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2-λ1);
        
	var bearing = toDegrees(Math.atan2(y, x));
	
	return bearing;
}
exports.calculateBearing = calculateBearing;