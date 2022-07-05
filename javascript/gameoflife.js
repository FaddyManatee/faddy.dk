/*
 *
 */


$(document).ready(function() {
    // Hide the error message element.
    $("#conwayerror").hide();

    // Hide start and pause button.
    $("#startbutton").hide();
    $("#pausebutton").hide();

    $(document).on("input", "#rowinputconway", function() {
        validateDimensionInput("#rowinputconway");
    });

    $(document).on("input", "#columninputconway", function() {
        validateDimensionInput("#columninputconway");
    });

    $(document).on("click", "#conwaymakegrid", function() {
        $("#pausebutton").hide();
        $("#pausebutton").text("PAUSE");
        conwayGrid();
    });

    $(document).on("click", "#startbutton", function() {
        $(this).hide();
        $("#pausebutton").show();
        gameoflife();
    });

    $(document).on("click", "#pausebutton", function() {
        pause();
    });

    $(document).on("input", "#speedinput", function() {
        changeSpeed();
    });

    var speed = 1000;
    var gridGenerated = false;
    var running = false;
    var gridRows = 0;
    var gridColumns = 0;
    var intervalID;

    function conwayGrid() {
        gridRows = parseInt($("#rowinputconway").val(), 10);
        gridColumns = parseInt($("#columninputconway").val(), 10);
    
        // Exit if required input fields are empty.
        if (isNaN(gridRows) || isNaN(gridColumns)) {
            $("#conwayerror").text("PLEASE SPECIFY THE NUMBER OF BOTH ROWS AND COLUMNS");
            $("#conwayerror").show();
            return;
        }
        else {
            $("#conwayerror").hide();
        }
    
        var grid = $("#conwaygrid");
    
        // Clear any existing table.
        grid.empty();
    
        // If the game has been reset it should not be running.
        terminate();
    
        var table = document.createElement("table");
    
        grid[0].appendChild(table);
        for (var x = 0; x < gridRows; x++) {
            var row = document.createElement("tr");
            for (var y = 0; y < gridColumns; y++) {
                var cell = document.createElement("td");
                cell.innerHTML = "<button type=\"button\" title=\"Cell\" class=\"dead\" id=\"conway" + x + "_" + y + "\" " + "onclick=\"toggle(" + x + ", " + y + ")\"" + "></button>";
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
    
        gridGenerated = true;

        // Show start button.
        $("#startbutton").show();
    }

    /*
    * Gets triggered on input. Input must be a positive integer.
    */
    function validateDimensionInput(id) {
        var input = $(id).val();

        // Get the last character code of the input.
        lastChar = input.charCodeAt(input.length - 1);
        
        // If this character is not an integer, remove it.
        if (!(lastChar >= 48 && lastChar <= 57)) {
            input = input.slice(0, -1);
            $(id).val(input);
        }

        // If not a positive integer, clear the input.
        if (parseInt(input, 10) < 1) {
            $(id).val("");
        }
    }


    /*
    *
    */
    function gameoflife() {
        // The grid does not exist yet and we should exit.
        if (!gridGenerated) {
            return;
        }

        // The game is now running.
        running = true;

        // Start the cycle() call interval every 'speed' milliseconds.
        intervalID = setInterval(cycle, speed);
    }


    function cycle() {
        // Create a 2D array to store the new state of the grid for the next cycle.
        nextCycle = new Array(gridRows);

        var row;
        var column;
        for (row = 0; row < nextCycle.length; row++) {
            nextCycle[row] = new Array(gridColumns);
        }

        // Iterate over each cell of the grid and count its live neighbours.
        var liveNeighbours = 0;
        var button;
        for (row = 0; row < gridRows; row++) {
            for (column = 0; column < gridColumns; column++) {
                // Check status of left neighbour if it exists.
                if (column - 1 >= 0) {
                    button = $("#conway" + row + "_" + (column - 1));
                    if (button.hasClass("alive")) {
                        liveNeighbours++;
                    }
                }
            
                // Check status of right neighbour if it exists.
                if (column + 1 < gridColumns) {
                    button = $("#conway" + row + "_" + (column + 1));
                    if (button.hasClass("alive")) {
                        liveNeighbours++;
                    }
                }

                // Check status of top neighbour if it exists.
                if (row - 1 >= 0) {
                    button = $("#conway" + (row - 1) + "_" + column);
                    if (button.hasClass("alive")) {
                        liveNeighbours++;
                    }
                }

                // Check status of bottom neighbour if it exists.
                if (row + 1 < gridRows) {
                    button = $("#conway" + (row + 1) + "_" + column);
                    if (button.hasClass("alive")) {
                        liveNeighbours++;
                    }
                }

                // Check status of top right neighbour if it exists.
                if (row - 1 >= 0 && column + 1 < gridColumns) {
                    button = $("#conway" + (row - 1) + "_" + (column + 1));
                    if (button.hasClass("alive")) {
                        liveNeighbours++;
                    }
                }

                // Check status of bottom right neighbour if it exists.
                if (row + 1 < gridRows && column + 1 < gridColumns) {
                    button = $("#conway" + (row + 1) + "_" + (column + 1));
                    if (button.hasClass("alive")) {
                        liveNeighbours++;
                    }
                }

                // Check status of top left neighbour if it exists.
                if (row - 1 >= 0 && column - 1 >= 0) {
                    button = $("#conway" + (row - 1) + "_" + (column - 1));
                    if (button.hasClass("alive")) {
                        liveNeighbours++;
                    }
                }

                // Check status of bottom left neighbour if it exists.
                if (row + 1 < gridRows && column - 1 >= 0) {
                    button = $("#conway" + (row + 1) + "_" + (column - 1));
                    if (button.hasClass("alive")) {
                        liveNeighbours++;
                    }
                }

                // Apply Conway's rules for the game to determine next state (1=alive, 0=dead).
                button = $("#conway" + row + "_" + column)

                if (button.hasClass("alive") && liveNeighbours > 3) {
                    // Button in next cycle dies due to overpopulation.
                    nextCycle[row][column] = 0;
                }
                else if (button.hasClass("alive") && liveNeighbours < 2) {
                    // Button in next cycle dies due to underpopulation.
                    nextCycle[row][column] = 0;
                }
                else if (button.hasClass("dead") && liveNeighbours == 3) {
                    // Button in next cycle is reborn.
                    nextCycle[row][column] = 1;
                }
                else if (button.hasClass("alive")) {
                    // Buttons that didn't change state are the same in the next cycle.
                    nextCycle[row][column] = 1;
                }
                else if (button.hasClass("dead")) {
                    // Buttons that didn't change state are the same in the next cycle.
                    nextCycle[row][column] = 0;
                }

                // Reset neighbour count to 0 for next iteration.
                liveNeighbours = 0;
            }
        }

        // Change the grid to the next state.
        for (row = 0; row < gridRows; row++) {
            for (column = 0; column < gridColumns; column++) {
                changeState(row, column, nextCycle[row][column]);
            }
        }
    }


    function changeState(row, column, state) {
        var button = $("#conway" + row + "_" + column);

        if (state == 0) {
            button.removeClass("alive");
            button.addClass("dead");
        }
        else if (state == 1) {
            button.removeClass("dead");
            button.addClass("alive");
        }
    }


    /*
    * 
    */
    function changeSpeed() {
        var sliderValue = parseInt($("#speedinput").val(), 10);
        
        var speedFactors = [3200, 1600, 800, 400, 200, 100, 50];

        // Change speed according to slider value.
        speed = speedFactors[sliderValue];

        // Reset the interval that cycle is called with if running.
        if (running) {
            clearInterval(intervalID);
            gameoflife();
        }
    }


    function pause() {
        // Stop the cycle() call interval if the game is not paused, else resume.
        if (running) {
            clearInterval(intervalID);
            running = false;

            // Change the text of the pause button to 'Resume'.
            $("#pausebutton").text("RESUME");
        }
        else {
            running = true;

            // Change the text of the pause button to 'Pause'.
            $("#pausebutton").text("PAUSE");

            // Start gameoflife() again.
            gameoflife();
        }
    }


    function terminate() {
        // Stop cycle() call interval.
        clearInterval(intervalID);
        running = false;

        // Change the text of the pause button to 'Pause'.
        $("#pauseButton").text("PAUSE");
    }
});


/*
* 
*/
function toggle(row, column) {
    var button = $("#conway" + row + "_" + column);

    if (button.hasClass("alive")) {
        button.removeClass("alive");
        button.addClass("dead");
    }
    else if (button.hasClass("dead")) {
        button.removeClass("dead");
        button.addClass("alive");
    }
}
