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
    var rndX = 0;
    var rndY = 0;

    // Determine a general x direction (left, right)
    var xDirection = Math.floor(Math.random() * 1);

    // Determine a general y direction (up, down)
    var yDirection = Math.floor(Math.random() * 1);

    const limit = 500;
    var max = 0;
    var min = 0;

    // Generate a coordinate outside of the canvas space using the general directions
    if (xDirection == 0) {
        // Down
        max = canvasHeight + limit;
        min = canvasHeight;

        rndX = Math.floor(Math.random() * (max - min + 1) ) + min;
    }
    else {
        // Up
        max = 0;
        min = -limit;

        rndX = Math.floor(Math.random() * (max - min + 1) ) + min;
    }

    if (yDirection == 0) {
        // Right
        max = canvasWidth + limit;
        min = canvasWidth;

        rndY = Math.floor(Math.random() * (max - min + 1) ) + min;
    }
    else {
        // Left
        max = 0;
        min = -limit;

        rndY = Math.floor(Math.random() * (max - min + 1) ) + min;
    }

    var coordinate = {x: rndX, y: rndY};

    // Check each edge of the canvas for an intersection of the line between the rectangle position and the coordinate outside of the canvas
    const canvasEdges = [{pos1: {x: 0, y: 0} , pos2: {x: canvasWidth - 1, y: 0}},
                         {pos1: {x: 0, y: canvasHeight - 1} , pos2: {x: canvasWidth - 1, y: canvasHeight - 1}},
                         {pos1: {x: 0, y: 0} , pos2: {x: 0, y: canvasHeight - 1}},
                         {pos1: {x: canvasWidth - 1, y: 0} , pos2: {x: canvasWidth - 1, y: canvasHeight - 1}}];

    var intersection;
    console.log(canvasWidth);
    console.log(canvasHeight);
    for (var x = 0; x < canvasEdges.length; x++) {
        intersection = FindIntersection({pos1: {x: rect.x, y: rect.y}, pos2: coordinate}, canvasEdges[x]);

        // If the intersection is not within the canvas, continue
        if (intersection.x < 0 || intersection.x > canvasWidth - 1 || intersection.y < 0 || intersection.y > canvasHeight - 1)
            continue;

        // Break if there exists a valid intersection
        if (intersection.x == 0 || intersection.x == canvasWidth - 1 || intersection.y == 0 || intersection.y == canvasHeight - 1) {
            // Tests
            console.log(intersection);
            g.moveTo(intersection.x + 20, intersection.y);
            g.arc(intersection.x, intersection.y, 20, 0, 2 * Math.PI);
            g.stroke();
            break;
        }
    }

    // Calculate the vector that brings the rectangle to the intersection and return it

}


// Finds the intersection between two lines, a and b. Returns undefined if no intersect was found
function FindIntersection(a, b) {
    var solutionX = undefined;
    var solutionY = undefined;

    var gradientA = (a.pos1.y - a.pos2.y) / (a.pos1.x - a.pos2.x);
    var gradientB = (b.pos1.y - b.pos2.y) / (b.pos1.x - b.pos2.x);

    // The lines are parallel and will not meet
    if (gradientA == gradientB || (Math.abs(gradientA) == Infinity && Math.abs(gradientB) == Infinity))
        return undefined;

    // c = y - mx
    var interceptA = a.pos1.y - (gradientA * a.pos1.x);
    var interceptB = b.pos1.y - (gradientB * b.pos1.x);

    // Handle cases for vertical lines
    if (Math.abs(gradientA) == Infinity) {
        solutionX = a.pos1.x;
        solutionY = (gradientB * solutionX) + interceptB;
    }
    else if (Math.abs(gradientB) == Infinity) {
        solutionX = b.pos1.x;
        solutionY = (gradientA * solutionX) + interceptA;  
    }

    // We now have enough information to solve the simultaneous equations a and b (both of the form y=mx+c)
    // We start with maxa + ca = mbxb + cb
    var ma = gradientA;
    var mb = gradientB;
    var ca = interceptA;
    var cb = interceptB;

    // Move ca onto RHS
    if (ca > 0) {
        cb = cb - ca;
    }
    else if (ca < 0) {
        cb = cb + ca;
    }

    // Move mbxb onto LHS
    if (mb > 0) {
        ma = ma - mb;
    }
    else if (mb < 0) {
        ma = ma + mb;
    }

    solutionX = cb / ma;

    // Use one of the line equations to find a solution for y
    solutionY = (gradientA * solutionX) + interceptA;
    
    return {x: solutionX, y: solutionY};
}
