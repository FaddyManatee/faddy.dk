/*
 *
 */


$(document).ready(function() {
    // Hide the error message element.
    $("#wordsearcherror").hide();

    $(document).on("input", "#rowinputsearch", function() {
        validateDimensionInput("#rowinputsearch");
    });

    $(document).on("input", "#columninputsearch", function() {
        validateDimensionInput("#columninputsearch");
    });

    $(document).on("click", "#searchmakegrid", function() {
        wordsearchGrid();
    });

    $(document).on("input", "#searchinput", function() {
        validateSearchInput("#searchinput");
    });

    $(document).on("click", "#searchforword", function() {
        wordsearch();
    });

    var gridGenerated = false;
    var gridRows = 0;
    var gridColumns = 0;

    function wordsearchGrid() {
        $("#wordsearcherror").hide();
        gridRows = parseInt($("#rowinputsearch").val(), 10);
        gridColumns = parseInt($("#columninputsearch").val(), 10);

        // Exit if required input fields are empty.
        if (isNaN(gridRows) || isNaN(gridColumns)) {
            $("#wordsearcherror").text("PLEASE SPECIFY THE NUMBER OF BOTH ROWS AND COLUMNS");
            $("#wordsearcherror").show();
            return;
        }
        else {
            $("wordsearcherror").hide();
        }

        var grid = $("#wordsearchgrid");

        // Clear existing table
        grid.empty();

        var table = document.createElement("table");
        grid[0].appendChild(table);

        for (var x = 0; x < gridRows; x++) {
            var row = document.createElement("tr");
            for (var y = 0; y < gridColumns; y++) {
                var cell = document.createElement("td");
                cell.innerHTML = "<input type=\"text\" class=\"unflagged\" id=\"wordsearch" + x + "_" + y + "\" maxlength=" + "\"1\"" + "oninput=\"validateCellInput(" + x + ", " + y + ")\"" + ">";
                row.appendChild(cell);
            }
            table.appendChild(row);
        }

        gridGenerated = true;
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
    * Gets triggered on input.
    * Validates the input text to check whether invalid characters are present.
    * All characters must be in the 65-90 ASCII value range, so capitalise lower case.
    */
    function validateSearchInput(id) {
        var input = $(id).val();

        // Get the last character code of the input.
        var lastChar = input.charCodeAt(input.length - 1);
        
        // If this character is lower case, capitalise it.
        if (lastChar >= 97 && lastChar <= 122) {
            // Remove last character.
            input = input.slice(0, -1)

            // Append the capitalised character by subtracting 32.
            $(id).val(input.concat(String.fromCharCode(lastChar - 32)));
        }

        // Get the textbox's new value.
        input = $(id).val();

        // Get the last character code of the input.
        lastChar = input.charCodeAt(input.length - 1);

        // If this character is not in valid range, remove it.
        if (!(lastChar >= 65 && lastChar <= 90)) {
            input = input.slice(0, -1);
            $(id).val(input);
        }
    }


    /*
    *
    */
    function wordsearch() {
        // The grid does not exist yet and we should exit.
        if (!gridGenerated) {
            return;
        }

        // Hide any errors.
        $("#wordsearcherror").hide();

        // Remove flagged class.
        $(".flagged").addClass("unflagged");
        $(".flagged").removeClass("flagged");

        // Get the word we should search for.
        var searchWord = $("#searchinput").val();

        // Exit if this value is empty.
        if (searchWord == "") {
            $("#wordsearcherror").text("ENTER A WORD TO SEARCH FOR");
            $("#wordsearcherror").show();
            return;
        }
        else {
            $("#wordsearcherror").hide();
        }

        var row = 0;
        var column = 0;

        // Get 2D array representation of the wordsearch grid.
        puzzle = new Array(gridRows);
        for (row = 0; row < gridRows; row++) {
            puzzle[row] = new Array(gridColumns);
        }

        // Read the cells and return if not all of the cells have a character in them.
        var letter = "";
        for (row = 0; row < gridRows; row++) {
            for (column = 0; column < gridColumns; column++) {
                letter = $("#wordsearch" + row + "_" + column).val();
                
                if (letter == "") {
                    $("#wordsearcherror").text("PLEASE FILL IN ALL CELLS OF THE GRID");
                    $("#wordsearcherror").show();
                    return;
                }

                // Assign letter to appropriate 2D array position if not empty.
                puzzle[row][column] = letter;
            }
        }

        // Get the possible start locations for our search word.
        var possibleLocations = new Array();
        for (row = 0; row < gridRows; row++) {
            for (column = 0; column < gridColumns; column++) {
                if (searchWord.charAt(0) == puzzle[row][column]) {
                    // Append the possible start location.
                    possibleLocations.push([row, column]);
                }
            }
        }

        // An array of results of searching the word in each direction from the starting character.
        var results = [];

        var resultOfSearch;

        // Try to search the word at each possible start location.
        for (var location = 0; location < possibleLocations.length; location++) {
            var charsFound = 1;

            var charList = [possibleLocations[location]];

            // Try to search the word horizontally.
            resultOfSearch = horizSearch(puzzle, searchWord, possibleLocations[location], charList, charsFound);
            results.push(resultOfSearch);

            // Try to search the word anti-horizontally.
            charList = [possibleLocations[location]];
            resultOfSearch = revHorizSearch(puzzle, searchWord, possibleLocations[location], charList, charsFound);
            results.push(resultOfSearch);

            // Try to search the word vertically.
            charList = [possibleLocations[location]];
            resultOfSearch = vertSearch(puzzle, searchWord, possibleLocations[location], charList, charsFound);
            results.push(resultOfSearch);

            // Try to search the word anti-vertically.
            charList = [possibleLocations[location]];
            resultOfSearch = revVertSearch(puzzle, searchWord, possibleLocations[location], charList, charsFound);
            results.push(resultOfSearch);

            // Try to search the word diagonally to the right up.
            charList = [possibleLocations[location]];
            resultOfSearch = rUpDiagSearch(puzzle, searchWord, possibleLocations[location], charList, charsFound);
            results.push(resultOfSearch);

            // Try to search the word diagonally to the left up.
            charList = [possibleLocations[location]];
            resultOfSearch = lUpDiagSearch(puzzle, searchWord, possibleLocations[location], charList, charsFound);
            results.push(resultOfSearch);

            // Try to search the word diagonally to the right down.
            charList = [possibleLocations[location]];
            resultOfSearch = rDownDiagSearch(puzzle, searchWord, possibleLocations[location], charList, charsFound);
            results.push(resultOfSearch);

            // Try to search the word diagonally to the left down.
            charList = [possibleLocations[location]];
            resultOfSearch = lDownDiagSearch(puzzle, searchWord, possibleLocations[location], charList, charsFound);
            results.push(resultOfSearch);
        }

        // Searches that were unsuccessful return 0. Remove them from results[].
        results = results.filter(function notZero(value) { return value != 0; });

        if (results.length == 0) {
            $("#output").text("The word was not found!");
        }
        else {
            // Colour the cells that formed the search word.
            for (var item = 0; item < results.length; item++) {
                for (var character = 0; character < searchWord.length; character++) {
                    var textBoxPos = results[item][character];
                    var id = "#wordsearch" + textBoxPos[0] + "_" + textBoxPos[1];
                    var textBox = $(id);
                    textBox.removeClass("unflagged");
                    textBox.addClass("flagged");
                }
            }
        }
    }


    function horizSearch(grid, word, location, answer, count) {
        if (count == word.length) {
            return answer;
        }
        else {
            if (location[1] + 1 < gridColumns && grid[location[0]][location[1] + 1] == word.charAt(count)) {
                var newLocation = [location[0], location[1] + 1];
                answer.push([location[0], location[1] + 1]);
                return horizSearch(grid, word, newLocation, answer, count + 1);
            }
            else {
                return 0;
            }
        }
    }


    function revHorizSearch(grid, word, location, answer, count) {
        if (count == word.length) {
            return answer;
        }
        else {
            if (location[1] - 1 >= 0 && grid[location[0]][location[1] - 1] == word.charAt(count)) {
                var newLocation = [location[0], location[1] - 1];
                answer.push([location[0], location[1] - 1]);
                return revHorizSearch(grid, word, newLocation, answer, count + 1);
            }
            else {
                return 0;
            }
        }
    }


    function vertSearch(grid, word, location, answer, count) {
        if (count == word.length) {
            return answer;
        }
        else {
            if (location[0] + 1 < gridRows && grid[location[0] + 1][location[1]] == word.charAt(count)) {
                var newLocation = [location[0] + 1, location[1]];
                answer.push([location[0] + 1, location[1]]);
                return vertSearch(grid, word, newLocation, answer, count + 1);
            }
            else {
                return 0;
            }
        }
    }


    function revVertSearch(grid, word, location, answer, count) {
        if (count == word.length) {
            return answer;
        }
        else {
            if (location[0] - 1 >= 0 && grid[location[0] - 1][location[1]] == word.charAt(count)) {
                var newLocation = [location[0] - 1, location[1]];
                answer.push([location[0] - 1, location[1]]);
                return revVertSearch(grid, word, newLocation, answer, count + 1);
            }
            else {
                return 0;
            }
        }
    }


    function rUpDiagSearch(grid, word, location, answer, count) {
        if (count == word.length) {
            return answer;
        }
        else {
            if (location[0] - 1 >= 0 && location[1] + 1 < gridColumns && grid[location[0] - 1][location[1] + 1] == word.charAt(count)) {
                var newLocation = [location[0] - 1, location[1] + 1];
                answer.push([location[0] - 1, location[1] + 1]);
                return rUpDiagSearch(grid, word, newLocation, answer, count + 1);
            }
            else {
                return 0;
            }
        }
    }


    function lUpDiagSearch(grid, word, location, answer, count) {
        if (count == word.length) {
            return answer;
        }
        else {
            if (location[0] - 1 >= 0 && location[1] - 1 >= 0 && grid[location[0] - 1][location[1] - 1] == word.charAt(count)) {
                var newLocation = [location[0] - 1, location[1] - 1];
                answer.push([location[0] - 1, location[1] - 1]);
                return lUpDiagSearch(grid, word, newLocation, answer, count + 1);
            }
            else {
                return 0;
            }
        }
    }


    function rDownDiagSearch(grid, word, location, answer, count) {
        if (count == word.length) {
            return answer;
        }
        else {
            if (location[0] + 1 < gridRows && location[1] + 1 < gridColumns && grid[location[0] + 1][location[1] + 1] == word.charAt(count)) {
                var newLocation = [location[0] + 1, location[1] + 1];
                answer.push([location[0] + 1, location[1] + 1]);
                return rDownDiagSearch(grid, word, newLocation, answer, count + 1);
            }
            else {
                return 0;
            }
        }
    }


    function lDownDiagSearch(grid, word, location, answer, count) {
        if (count == word.length) {
            return answer;
        }
        else {
            if (location[0] + 1 < gridRows && location[1] - 1 >= 0 && grid[location[0] + 1][location[1] - 1] == word.charAt(count)) {
                var newLocation = [location[0] + 1, location[1] - 1];
                answer.push([location[0] + 1, location[1] - 1]);
                return lDownDiagSearch(grid, word, newLocation, answer, count + 1);
            }
            else {
                return 0;
            }
        }
    }
});


/*
* Gets triggered on input.
*/
function validateCellInput(row, column) {
    textBox = $("#wordsearch" + row + "_" + column);

    // Capitalise the character if lower case.
    if (textBox.val().charCodeAt(0) >= 97 && textBox.val().charCodeAt(0) <= 122) {
        textBox.val(textBox.val().toUpperCase());
    }

    // Clear the character if still not a upper case character.
    if (!(textBox.val().charCodeAt(0) >= 65 && textBox.val().charCodeAt(0) <= 90)) {
        textBox.val("");
    }
}
