/**
 * The goal of this script is to imitate the "Bouncing DVD logo" effect 
 */

var canvas;
var animationRequest;
var rectangle;
var vector;
var gradient;
var g;

// TEST
var initial;
// TEST/

// STATS
var start;
var finish;
// STATS/

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
    vector = RandomVector();

    // Calculate the gradient of the vector relative to the rectangle
    gradient = ((rectangle.y + vector.dy) - rectangle.y) / ((rectangle.x + vector.dx) - rectangle.x);

    // STATS
    start = new Date();
    // STATS/

    // Perform the animation
    animationRequest = window.requestAnimationFrame(Move);

    // Calculate a new vector to perform the bounce and repeat
    // ...
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

    // TEST
    initial = {x: rndColumn, y: rndRow};
    // TEST/

    // Return its properties
    return {x: rndColumn, y: rndRow, w: width, h: height};
}


// Generates a random vector for the rectangle to move along in which it will hit a canvas edge
function RandomVector() {
    // Pick a random edge
    var edge = Math.floor(Math.random() * 4);

    var rndPoint;
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
    // TEST/

    // Calculate the vector that brings the rectangle to the intersection and return it
    // intersection - rectangle
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
        gradient = 10000;
    }
    else if (gradient == -Infinity) {
        // Vertically downwards
        gradient = -10000;
    }

    // Since gradient effects the speed of the animation, calculate a multiplier for consistent speed across all gradients (WIP)
    var factor = 1; // (Math.pow(Math.abs(gradient), -1)) * 10 / ((canvas.height / Math.abs(gradient)) / 60);
    
    // Apply effects of gradient 
    rectangle.x = rectangle.x + ((vector.dx / Math.abs(vector.dx)) * factor);
    rectangle.y = rectangle.y + ((vector.dy / Math.abs(vector.dy)) * Math.abs(gradient) * factor);

    // Decrement the vector accordingly
    if (vector.dx > 0) {
        vector.dx = vector.dx - factor;
    }
    else if (vector.dx < 0) {
        vector.dx = vector.dx + factor;
    }

    if (vector.dy > 0) {
        vector.dy = (vector.dy - (gradient * factor));
    }
    else if (vector.dy < 0) {
        vector.dy = (vector.dy + (gradient * factor));
    }

    // TEST
    g.rect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
    g.stroke();
    // TEST/

    /*
     Floor and ceil functions on rectangle.y as it may become decimal due to the gradient, 
     otherwise the animation will continue until the vector translation is complete
    */
    if (rectangle.x <= 0 || rectangle.y <= 0 || rectangle.x + rectangle.w >= canvas.width - 1 || rectangle.y + rectangle.h >= canvas.height - 1) {
        // The rectangle has hit an edge of the canvas

        // STATS
        console.log("Gradient: " + gradient);
        finish = new Date();
        var time = (finish.getTime() - start.getTime()) / 1000;
        var distance = Math.sqrt(Math.pow(rectangle.x - initial.x, 2) + Math.pow(rectangle.y - initial.y, 2));
        var speed = distance / time;
        console.log("Distance: " + distance + "px");
        console.log("Time: " + time + "s");
        console.log("Speed: " + speed + "px/s");
        $("#gradient").text(gradient);
        $("#speed").text(speed);
        // STATS/

        cancelAnimationFrame(animationRequest);
    }
    else if (vector.dx == 0 || vector.dy == 0) {
        // Vector translation is complete. The animation has ended
        
        // STATS
        console.log("Gradient: " + gradient);
        finish = new Date();
        var time = (finish.getTime() - start.getTime()) / 1000;
        var distance = Math.sqrt(Math.pow(rectangle.x - initial.x, 2) + Math.pow(rectangle.y - initial.y, 2));
        var speed = distance / time; 
        console.log("Distance: " + distance + "px");
        console.log("Time: " + time + "s");
        console.log("Speed: " + speed + "px/s");
        $("#gradient").text(gradient);
        $("#speed").text(speed);
        // STATS/

        cancelAnimationFrame(animationRequest);
    }
    else {
        requestAnimationFrame(Move);
    }
}
