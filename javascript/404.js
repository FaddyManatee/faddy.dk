/**
 * The goal of this script is to imitate the "Bouncing DVD logo" effect 
 */

var canvasWidth = 0;
var canvasHeight = 0;
var g;

$(document).ready(function() {
    // Retrieve the canvas object to manipulate
    canvas = $("#errorcanvas")[0];
    
    // Make the canvas fill the entire webpage
    canvas.width = $(window).width();
    canvas.height = $(window).height();
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    // Graphics drawing context setup
    g = canvas.getContext("2d");
    
    // Draw a test rectangle
    var rectangle = RandomRectangle(300, 100);

    // Initial vector to move the rectangle along to initiate the animation
    var vector = RandomVector(rectangle);
});


// Generates a rectangle in a random position on the canvas such that the rectangle can be fully drawn, and returns its properties
function RandomRectangle(width, height) {
    var rndRow;
    var rndColumn;

    // Remove coordinate space where the rectangle cannot be fully drawn from the random selection
    rndRow = Math.floor(Math.random() * (canvasHeight - height));
    rndColumn = Math.floor(Math.random() * (canvasWidth - width));

    // Draw the rectangle
    g.rect(rndColumn, rndRow, width, height);
    g.stroke();

    // Return its properties
    return {x: rndColumn, y: rndRow, w: width, h: height};
}


// Generates a random vector for the rectangle to move along in which it will hit a canvas edge
function RandomVector(rect) {
    // Pick a random edge
    var edge = Math.floor(Math.random() * 4);

    var rndPoint;
    var intersection;

    switch (edge) {
        case 0:
            // Pick a random point along the top edge
            rndPoint = Math.floor(Math.random() * canvasWidth);
            intersection = {x: rndPoint, y: 0};
            break;
    
        case 1:
            // Pick a random point along the bottom edge
            rndPoint = Math.floor(Math.random() * canvasWidth);
            intersection = {x: rndPoint, y: canvasHeight - 1};
            break;
        
        case 2:
            // Pick a random point along the left edge
            rndPoint = Math.floor(Math.random() * canvasHeight);
            intersection = {x: 0, y: rndPoint};
            break;
        
        case 3:
            // Pick a random point along the right edge
            rndPoint = Math.floor(Math.random() * canvasHeight);
            intersection = {x: canvasWidth - 1, y: rndPoint};
            break;
    }

    // TEST - rect will no longer be needed as a parameter
    g.lineTo(intersection.x, intersection.y);
    g.moveTo(intersection.x + 20, intersection.y);
    g.arc(intersection.x, intersection.y, 20, 0, 2 * Math.PI);
    g.stroke();
    g.moveTo(rect.x, rect.y);


    // Calculate the vector that brings the rectangle to the intersection and return it
}
