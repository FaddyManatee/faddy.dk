/*
 * A Vigenere Cipher tool I wrote in October 2021, rewritten in JavaScript in March 2022 from 
 * Python.
 * 
 * The length of the key to encrypt/decrypt must be of size greater than or equal to that of the
 * plaintext/ciphertext.
 * 
 * Characters of the key beyond the length of the plaintext are ignored.
 * 
 * If a key is smaller than the length of the plaintext/ciphertext, repeat its characters until the
 * length of both strings are equal.
 */


$(document).ready(function() {
    // Hide the error message element.
    $("#vigenereerror").hide();

    $(document).on("input", "#vigenereinput", function() {
        validateTextInput("#vigenereinput");
    });

    $(document).on("input", "#vigenerekeyinput", function() {
        validateTextInput("#vigenerekeyinput");
    });

    $(document).on("click", "#vigenereencrypt", function() {
        vigenereCipher(0);
    });

    $(document).on("click", "#vigeneredecrypt", function() {
        vigenereCipher(1);
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

    function vigenereCipher(option) {
        var inputText = $("#vigenereinput").val();
        var key = $("#vigenerekeyinput").val();
        inputText.trim();
        key.trim();
    
        // Repeat characters of the key if it is shorter than the input text.
        if (key.length < inputText.length) {
            var x;
            // Iterate over characters in input without a character from the key mapped to it.
            var originalKey = key;
            for (x = 0; x < inputText.length - originalKey.length; x++) {
                // Extend the key by another character, starting at the beginning of the key.
                if (x + 1 <= key.length) {
                    key = key.concat(key.charAt(x));
                }
            }
        }
    
        var result = "";
        if (option == 0) {
            result = encrypt(inputText, key);
        }
        else if (option == 1) {
            result = decrypt(inputText, key);
        }
    
        $("#vigenereoutput").text(result);
    }

    /*
     *
     */
    function encrypt(text, key) {
        // Iterate over each character of the plaintext and encrypt.
        var cipherText = "";
        var offset = 0;
        
        var character;
        for (character = 0; character < text.length; character++) {
            offset = key.charCodeAt(character) - 32;

            if (text.charCodeAt(character) + offset <= 126) {
                cipherText = cipherText.concat(String.fromCharCode(text.charCodeAt(character) + offset));
            }
            else {
                cipherText = cipherText.concat(String.fromCharCode(text.charCodeAt(character) + offset - 95));
            }
        }

        return cipherText;
    }


    /*
     *
     */
    function decrypt(text, key) {
        // Iterate over each character of the ciphertext and decrypt.
        var plainText = "";
        var offset = 0;
        
        var character;
        for (character = 0; character < text.length; character++) {
            offset = key.charCodeAt(character) - 32;

            if (text.charCodeAt(character) - offset < 32) {
                plainText = plainText.concat(String.fromCharCode(text.charCodeAt(character) - offset + 95));
            }
            else {
                plainText = plainText.concat(String.fromCharCode(text.charCodeAt(character) - offset));
            }
        }

        return plainText;
    }
});
