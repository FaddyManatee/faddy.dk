/*
 * An Affine Cipher decryption tool I wrote in April 2020 to help me in the University of 
 * Southampton's National Cipher Challenge 2020. Rewritten in JavaScript in March 2022 from 
 * C# with much needed improvements, now modified to also function as an Affine Cipher
 * encryption tool.
 * 
 * The encryption function E and decryption function D applied to each character of the
 * plaintext/ciphertext are given by the following:
 * 
 * E(x) = (ax + b) mod m
 * 
 * D(x) = a^-1(x - b) mod m
 * 
 * where m is the size of an alphabet, here we use m = 95 of alphabet ranging from ASCII values
 * 32 to 126.
 * where x is the integer mapped to each character of the alphabet in the range 0...m - 1.
 * where a and b are the keys of the cipher, such that both a and m are coprime.
 * 
 * Coprime definition: .............................................
 * 
 * a^-1 is the Modular Multiplicative Inverse of (a modulo m), hence
 * 1 = (aa^-1 mod m)
 */


$(document).ready(function() {
    // Length of our alphabet.
    const m = 95;

    // Hide the error message element.
    $("#affineerror").hide();

    $(document).on("input", "#affineinput", function() {
        validateTextInput("#affineinput");
    });

    $(document).on("input", "#affinekeyainput", function() {
        validateAInput("#affinekeyainput");
    });

    $(document).on("input", "#affinekeybinput", function() {
        validateBInput("#affinekeybinput");
    });

    $(document).on("click", "#affineencrypt", function() {
        affineCipher(0);
    });

    $(document).on("click", "#affinedecrypt", function() {
        affineCipher(1);
    });


    /*
    * Validates the input text to check whether invalid characters are present.
    * All characters must be in the 32-126 ASCII value range.
    */
    function validateTextInput(id) {
        var input = $(id).val();

        // Get the last character code of the input.
        var lastChar = input.charCodeAt(input.length - 1);
        
        // If this character is not in valid range, remove it.
        if (!(lastChar >= 32 && lastChar <= 126)) {
            input = input.slice(0, -1);
            $(id).val("");
        }
    }

    /*
     * Gets triggered on input. Input must be greater than 0.
     */
    function validateAInput(id) {
        var input = $(id).val();

        // Get the last character code of the input.
        lastChar = input.charCodeAt(input.length - 1);
        
        // If this character is not an integer, remove it.
        if (!(lastChar >= 48 && lastChar <= 57)) {
            input = input.slice(0, -1);
            $(id).val(input);
        }

        // If not a positive integer between 0 and m - 1, clear the input.
        if (parseInt(input, 10) < 1) {
            $(id).val("");
        }
    }

    /*
     * Gets triggered on input. Input must be between 0 and m - 1.
     */
    function validateBInput(id) {
        var input = $(id).val();

        // Get the last character code of the input.
        lastChar = input.charCodeAt(input.length - 1);
        
        // If this character is not an integer, remove it.
        if (!(lastChar >= 48 && lastChar <= 57)) {
            input = input.slice(0, -1);
            $(id).val(input);
        }

        // If not a positive integer between 0 and m - 1, clear the input.
        if (parseInt(input, 10) < 1 || parseInt(input, 10) > m - 1) {
            $(id).val("");
        }
    }


    function affineCipher(option) {
        // Hide any errors
        $("#affineerror").hide();

        // Get the input text as an array of characters from text box and normalise it. 
        var inputText = $("#affineinput").val();
        inputText = inputText.trim();
    
        // Retrieve the 'a' and 'b' keys of our cipher.
        var a = $("#affinekeyainput").val();
        var b = $("#affinekeybinput").val();
        a = parseInt(a, 10);
        b = parseInt(b, 10);
    
        // Validate the input keys and exit if there was a failure.
        if (isNaN(mmi(a, m))) {
            $("#affineerror").text("THE 'A' KEY IS NOT COPRIME WITH 'm = " + m + "'");
            $("#affineerror").show();
            return;
        }
    
    
        // Perform the requested action. 0 for encryption, 1 for decryption.
        var result = "";
        if (option == 0) {
            result = affineEncrypt(inputText, a, b);
        }
        else if (option == 1) {
            result = affineDecrypt(inputText, a, b);
        }

        $("#affineoutput").text(result);
    }

    /*
     * E(x) = (ax + b) mod m
     */
    function affineEncrypt(text, a, b) {
        var x = 0;
        var cipherText = "";

        var character;
        for (character = 0; character < text.length; character++) {
            x = text.charCodeAt(character) - 32;

            cipherText = cipherText.concat(String.fromCharCode(xToChar(canonicalMod(a * x + b, m))));
        }

        return cipherText;
    }

    /*
     * D(x) = a^-1(x - b) mod m
     *
     * a^-1 is the Modular Multiplicative Inverse (MMI) of (a modulo m), hence
     * 1 = (aa^-1 mod m)
     */
    function affineDecrypt(text, a, b) {
        var x = 0;
        var plainText = "";

        var character;
        for (character = 0; character < text.length; character++) {
            x = text.charCodeAt(character) - 32;

            plainText = plainText.concat(String.fromCharCode(xToChar(canonicalMod(mmi(a, m) * (x - b), m))));
        }

        return plainText;
    }


    /*
     * Attempts to find the Modular Multiplicative Inverse of two numbers, returning
     * NaN if no such number was found.
     * 
     * Can be used to determine whether two numbers are coprime. If NaN is returned, the
     * two numbers are not coprime.
     */
    function mmi(intOne, intTwo) {
        var mmi;
        for (mmi = 1; mmi < intTwo; mmi++) {
            if (((intOne % intTwo) * (mmi % intTwo)) % intTwo == 1) {
                return mmi;
            }
        }

        // There exists no MMI of 'a' and 'm' || 'a' and 'm' are not coprime.
        return NaN;
    }


    /*
     * Implements a more accurate modulus operator, since the % operator
     * does not accept negative values.
     * 
     * x mod m
     */
    function canonicalMod(x, m) {
        return (x % m + m) % m;
    }


    /*
     * Converts the integer mapped to each character in the cipher to its ASCII
     * code by adding 32.
     */
    function xToChar(x) {
        return x + 32;
    }
});
