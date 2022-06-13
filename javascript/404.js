/**
 * The goal of this script is to imitate the "Bouncing DVD logo" effect 
 */

var canvas;
var animationRequest;
var rectangle;
var vector;
var gradient;
var g;

$(document).ready(function() {
    // Retrieve the canvas object to manipulate
    canvas = $("#errorcanvas")[0];
    
    // Make the canvas fill the entire webpage
    canvas.width = $(window).width();
    canvas.height = $(window).height();

    // Graphics drawing context setup
    g = canvas.getContext("2d");
    
    // Draw a test rectangle
    rectangle = RandomRectangle(125, 125);

    // Initial vector to move the rectangle along to initiate the animation
    vector = RandomVector(rectangle);

    // Calculate the gradient of the vector relative to the rectangle
    gradient = ((rectangle.y + vector.dy) - rectangle.y) / ((rectangle.x + vector.dx) - rectangle.x);
    // Divide by 0?

    animationRequest = window.requestAnimationFrame(Move);
    // Calculate a new vector to perform the ricochet and repeat
});


// Generates a rectangle in a random position on the canvas such that the rectangle can be fully drawn, and returns its properties
function RandomRectangle(width, height) {
    var rndRow;
    var rndColumn;

    // Remove coordinate space where the rectangle cannot be fully drawn from the random selection
    rndRow = Math.floor(Math.random() * (canvas.height - height));
    rndColumn = Math.floor(Math.random() * (canvas.width - width));

    // Draw the rectangle
    g.rect(rndColumn, rndRow, width, height);
    g.stroke();

    // Return its properties
    return {x: rndColumn, y: rndRow, w: width, h: height};
}


// Generates a random vector for the rectangle to move along in which it will hit a canvas edge
function RandomVector() {
    // Pick a random edge
    var edge = Math.floor(Math.random() * 4);

    var rndPoint;
    var intersection;

    switch (edge) {
        case 0:
            // Pick a random point along the top edge
            rndPoint = Math.floor(Math.random() * canvas.width);
            intersection = {x: rndPoint, y: 0};
            break;
    
        case 1:
            // Pick a random point along the bottom edge
            rndPoint = Math.floor(Math.random() * canvas.width);
            intersection = {x: rndPoint, y: canvas.height - 1};
            break;
        
        case 2:
            // Pick a random point along the left edge
            rndPoint = Math.floor(Math.random() * canvas.height);
            intersection = {x: 0, y: rndPoint};
            break;
        
        case 3:
            // Pick a random point along the right edge
            rndPoint = Math.floor(Math.random() * canvas.height);
            intersection = {x: canvas.width - 1, y: rndPoint};
            break;
    }

    // TEST
    g.lineTo(intersection.x, intersection.y);
    g.moveTo(intersection.x + 20, intersection.y);
    g.arc(intersection.x, intersection.y, 20, 0, 2 * Math.PI);
    g.stroke();
    g.moveTo(rectangle.x, rectangle.y);


    // Calculate the vector that brings the rectangle to the intersection and return it
    // intersection - rect
    return {dx: intersection.x - rectangle.x, dy: intersection.y - rectangle.y};
}


// Moves the rectangle along the vector v until the translation is complete or the rectangle collides with an edge
function Move() {
    g.beginPath();
    g.fillStyle = "rgba(0, 0, 0, 0)";
    g.fillRect(0, 0, canvas.width, canvas.height);

    // Handle vertical lines
    if (gradient == Infinity) {
        // Vertically upwards
        gradient == 10000;
    }
    else if (gradient == -Infinity) {
        // Vertically downwards
        gradient == -10000;
    }
    else {
        // Apply effects of gradient 
        rectangle.x = rectangle.x + (vector.dx / Math.abs(vector.dx));
        rectangle.y = rectangle.y + ((vector.dy / Math.abs(vector.dy)) * Math.abs(gradient));
    }

    // Decrement the vector accordingly
    if (vector.dx > 0) {
        vector.dx = vector.dx - 1;
    }
    else if (vector.dx < 0) {
        vector.dx = vector.dx + 1;
    }

    if (vector.dy > 0) {
        vector.dy = vector.dy - gradient;
    }
    else if (vector.dy < 0) {
        vector.dy = vector.dy + gradient;
    }

    g.rect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
    g.stroke();

    /*
     Floor and ceil functions on rectangle.y as it may become decimal due to the gradient, 
     otherwise the animation will continue until the vector translation is complete
    */
    if (rectangle.x + rectangle.w == canvas.width || Math.ceil(rectangle.y) + rectangle.h == canvas.height || 
        Math.floor(rectangle.y) + rectangle.h == canvas.height) {
        // The rectangle has hit an edge of the canvas
        cancelAnimationFrame(animationRequest);
    }
    else if (vector.dx == 0 || vector.dy == 0) {
        // Vector translation is complete. The animation has ended
        cancelAnimationFrame(animationRequest);
    }
    else {
        requestAnimationFrame(Move);
    }
}
