function CompassSmoother(smoothingFactor) {
    var headingVector = [];
    this.smooth = function(newHeading) {
        var newHeadingVector = [ Math.cos(newHeading * Math.PI / 180), Math.sin(newHeading * Math.PI / 180) ];
        if (0 == headingVector.length) headingVector = newHeadingVector; else {
            headingVector[0] = headingVector[0] * (1 - smoothingFactor) + smoothingFactor * newHeadingVector[0];
            headingVector[1] = headingVector[1] * (1 - smoothingFactor) + smoothingFactor * newHeadingVector[1];
        }
        return (180 * Math.atan2(headingVector[1], headingVector[0]) / Math.PI + 360) % 360;
    };
}

module.exports = CompassSmoother;