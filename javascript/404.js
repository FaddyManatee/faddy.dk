/**
 * The goal of this script is to imitate the "Bouncing DVD logo" effect 
 */

var canvas;
var animationRequest;
var rectangle;
var point;
var gradient;
var factor;
var g;

// TEST
var initial;
var count = 1;
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

    // Initial point to move the rectangle towards to initiate the animation
    point = RandomPoint();

    // Calculate the gradient of the line that connects the point to the position of the rectangle 
    gradient = (rectangle.y - point.y) / (rectangle.x - point.x);

    // Since gradient effects the speed of the animation, calculate a multiplier for consistent speed across all gradients (WIP)
    factor = 1; // CalculateFactor(200);

    // STATS
    start = new Date();
    // STATS/

    // Perform the animation
    animationRequest = window.requestAnimationFrame(Move);
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


// Generates a random coordinate for the rectangle to move towards in which it will hit a canvas edge
function RandomPoint() {
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

    return intersection;
}


// Moves the rectangle along the gradient until the rectangle collides with an edge
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

    // Apply effects of gradient. Move towards the edge with the intersection/point
    if (point.x < rectangle.x) {
        rectangle.x = rectangle.x - factor;
    }
    else if (point.x > rectangle.x) {
        rectangle.x = rectangle.x + factor;
    }

    if (point.y < rectangle.y) {
        rectangle.y = rectangle.y - (Math.abs(gradient) * factor);
    }
    else if (point.y > rectangle.y) {
        rectangle.y = rectangle.y + (Math.abs(gradient) * factor);
    }

    // TEST
    g.rect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
    g.stroke();
    // TEST/

    // Check that the rectangle has hit an edge of the canvas
    if (rectangle.x <= 0 || rectangle.y <= 0 || rectangle.x + rectangle.w >= canvas.width - 1 || rectangle.y + rectangle.h >= canvas.height - 1) {
        // STATS
        console.log("Gradient: " + gradient);
        finish = new Date();
        var time = (finish.getTime() - start.getTime()) / 1000;
        var distance = Math.sqrt(Math.pow(rectangle.x - initial.x, 2) + Math.pow(rectangle.y - initial.y, 2));
        var speed = distance / time;
        console.log("Distance: " + distance + "px");
        console.log("Time: " + time + "s");
        console.log("Speed: " + speed + "px/s");
        console.log("Frames: " + count);
        $("#gradient").text(gradient);
        $("#speed").text(speed);
        // STATS/

        cancelAnimationFrame(animationRequest);
    }
    else {
        requestAnimationFrame(Move);
        count++;
    }
}
