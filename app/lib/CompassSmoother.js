//Smoothe MagneticHeading
function CompassSmoother(smoothingFactor) {
    var compassSmoother = {};
    var headingVector = [];
 
    this.smooth = function(newHeading) {
        var newHeadingVector = [ Math.cos(newHeading * Math.PI / 180), Math.sin(newHeading * Math.PI / 180)];
 
        if (headingVector.length == 0) {
            headingVector = newHeadingVector;
        } else {
            headingVector[0] = headingVector[0] * (1-smoothingFactor) + smoothingFactor * newHeadingVector[0];      
            headingVector[1] = headingVector[1] * (1-smoothingFactor) + smoothingFactor * newHeadingVector[1];
        }
        return ((Math.atan2(headingVector[1], headingVector[0]) * 180/Math.PI) + 360) % 360;
    };
    
    
}

module.exports = CompassSmoother;
 
