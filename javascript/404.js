/**
 * The goal of this script is to imitate the "Bouncing DVD logo" effect 
 */
var canvas;
var g;
var rectangle;

var image = new Image();
image.src = "images/ascii404compactreduced.png";

var gradient;
var factor;

// Translation = Vector, and translation can be edited by Move()
var vector;
var translation;


$(document).ready(function() {
    // Retrieve the canvas object to manipulate
    canvas = $("#errorcanvas")[0];
    
    // Make the canvas fill the entire webpage
    canvas.width = $(window).width();
    canvas.height = $(window).height();

    // Graphics drawing context setup
    g = canvas.getContext("2d", {alpha: false});
    g.fillStyle = "black";
    g.fillRect(0, 0, g.canvas.width, g.canvas.height);

    // Draw initial image
    rectangle = RandomRectangle(221, 335);
    g.drawImage(image, Math.floor(rectangle.x), Math.floor(rectangle.y));

    // Initial vector to move the rectangle along to initiate the animation
    vector = RandomVector();

    // Scale the vector to ensure it causes the rectangle to hit an edge when we change its direction on rebounds
    vector.dx = vector.dx * 10000;
    vector.dy = vector.dy * 10000;

    // Store a copy of the vector we can manipulate
    translation = vector;

    // Calculate the gradient of the vector relative to the rectangle
    gradient = ((rectangle.y + vector.dy) - rectangle.y) / ((rectangle.x + vector.dx) - rectangle.x);

    // Since gradient effects the speed of the animation, calculate a multiplier for consistent speed across all gradients (WIP)
    factor = CalculateFactor();

    // Perform the animation
    window.requestAnimationFrame(Move);
});


// Generates a rectangle in a random position on the canvas such that the rectangle can be fully drawn, and returns its properties
function RandomRectangle(width, height) {
    var rndRow;
    var rndColumn;

    // Remove coordinate space where the rectangle cannot be fully drawn from the random selection
    rndRow = Math.floor(Math.random() * (canvas.height - height));
    rndColumn = Math.floor(Math.random() * (canvas.width - width));

    // Draw the rectangle
    // g.rect(rndColumn, rndRow, width, height);
    // g.stroke();

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

    // Calculate the vector that brings the rectangle to the intersection and return it
    // intersection - rectangle
    return {dx: intersection.x - rectangle.x, dy: intersection.y - rectangle.y};
}


// Moves the rectangle along the vector v until the translation is complete or the rectangle collides with an edge
function Move() {
    g.beginPath();
    g.fillRect(rectangle.x - 1, rectangle.y - 1, rectangle.w + 1, rectangle.h + 1);
    
    // Handle vertical lines
    if (gradient == Infinity) {
        // Vertically upwards
        gradient = 10000;
    }
    else if (gradient == -Infinity) {
        // Vertically downwards
        gradient = -10000;
    }

    // Apply effects of gradient 
    if (translation.dx != 0) {
        rectangle.x = rectangle.x + (Math.sign(translation.dx) * factor);
    }

    if (translation.dy != 0) {
        rectangle.y = rectangle.y + (Math.sign(translation.dy) * Math.abs(gradient) * factor);
    }

    // Decrement the vector accordingly
    if (translation.dx > 0) {
        translation.dx = translation.dx - factor;
    }
    else if (translation.dx < 0) {
        translation.dx = translation.dx + factor;
    }

    if (translation.dy > 0) {
        translation.dy = (translation.dy - (gradient * factor));
    }
    else if (translation.dy < 0) {
        translation.dy = (translation.dy + (gradient * factor));
    }

    g.drawImage(image, Math.floor(rectangle.x), Math.floor(rectangle.y));

    // The rectangle has hit an edge of the canvas or the vector translation is complete
    if (rectangle.x <= 0 || rectangle.y <= 0 || rectangle.x + rectangle.w >= canvas.width - 1 || rectangle.y + rectangle.h >= canvas.height - 1 || (translation.dx == 0 && translation.dy == 0))
        Rebound();

    requestAnimationFrame(Move);
}


// (WIP) Approximation for consistent animation speeds regardless of gradient
function CalculateFactor() {
    var speed = 2.5;

    if (Math.abs(gradient) >= 1) {
        return Math.abs(Math.pow(gradient, -1)) * speed;
    }
    else {
        return Math.abs(gradient) * (Math.pow(Math.abs(gradient), -1)) * speed;
    }
}


// Manages movement of rectangle after collision with a canvas edge
function Rebound() {
    if (rectangle.x <= 0 || rectangle.x + rectangle.w >= canvas.width - 1) {
        vector.dx = -vector.dx;
    }
    else if (rectangle.y <= 0 || rectangle.y + rectangle.h >= canvas.height - 1) {
        vector.dy = -vector.dy;
    }

    translation = vector;
    gradient = -gradient;
}
