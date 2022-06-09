/**
 * The goal of this script is to imitate the "Bouncing DVD logo" effect 
 */

$(document).ready(function() {
    // Retrieve the canvas object to manipulate
    canvas = $("#errorcanvas")[0];
    
    // Make the canvas fill the entire webpage
    canvas.width = $(window).width();
    canvas.height = $(window).height();

    // Graphics drawing context setup
    var context = canvas.getContext("2d");
    context.font = "30px Arial";
    
    // Draw a test rectangle
    RandomRectangle(300, 100, canvas.width, canvas.height, context);
});


// Generates a rectangle in a random position on the canvas such that the rectangle can be fully drawn
function RandomRectangle(width, height, canvasWidth, canvasHeight, g) {
    var rndRow;
    var rndColumn;

    // Remove coordinate space where the rectangle cannot be drawn fully from the random selection
    rndRow = Math.floor(Math.random() * (canvasHeight - height));
    rndColumn = Math.floor(Math.random() * (canvasWidth - width));

    // Draw the rectangle
    g.rect(rndColumn, rndRow, width, height);
    g.stroke();
    g.fillText(" Temporary 404 Page", rndColumn, rndRow + (height * 0.55));
}
