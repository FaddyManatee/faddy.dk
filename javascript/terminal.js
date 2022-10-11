$(document).ready(function() {
    setTheme();
    hideAllDirectories();
    hideAllUI();
    $("#rotatescreen").hide();
    $("#quit").hide();
    $("#home").show();
    $("#readmeui").show();
    $(".logos p").hide();

    var lightTheme = window.matchMedia("(prefers-color-scheme: light)").matches;
    var soundEnabled = false;
    var isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;

    if (isMobile) {
        $("#rotatescreen").show();
        $("#rotatescreen").delay(3000).fadeOut();
    }

    // Update contents of the clock every second.
    setInterval(clock, 1000);
    function clock() {
        var date = new Date();
        var hours = String(date.getHours()).padStart(2, "0");
        var minutes = String(date.getMinutes()).padStart(2, "0");
        $("#clock").text(hours + ":" + minutes);
    }

    // Animate an aesthetic animation for shut down (- \ | /)
    var frames = 0;
    setInterval(shutdown, 50);
    function shutdown() {
        if ($("#quit").is(":visible")) {
            var text = $("#quit").text();

            switch (text) {
                case "SHUTTING DOWN -":
                    text = "SHUTTING DOWN \\";
                    break;
                
                case "SHUTTING DOWN \\":
                    text = "SHUTTING DOWN |";
                    break; 
                
                case "SHUTTING DOWN |":
                    text = "SHUTTING DOWN /";
                    break; 

                case "SHUTTING DOWN /":
                    text = "SHUTTING DOWN -";
                    break; 
            }

            frames++;
            $("#quit").text(text);

            // Redirect to previous page after certain amount of animation cycles completed.
            if (frames / 4 == 10) {
                fallbackUrl = "https://www.google.com/";
                var prevPage = window.location.href;
            
                window.history.back();
            
                // Fallback to a default if no previous page in the history after 2 seconds.
                setTimeout(function() { 
                    if (window.location.href == prevPage) {
                        window.location.href = fallbackUrl; 
                    }
                }, 2000);
            }
        }
    }

    // readme.txt interface.
    $("#readmefile").on({
        mouseenter: function() {
            hideAllUI();
            $("#readmeui").show();
            $("#program").text("");
        },

        click: function() {
            hideAllUI();
            $("#readmeui").show();
            $("#program").text("");
        },

        focus: function() {
            hideAllUI();
            $("#readmeui").show();
            $("#program").text("");
        }
    });

    // cowsay.txt interface.
    $("#cowsayfile").on({
        mouseenter: function() {
            hideAllUI();
            $("#cowsayui").show();
            $("#program").text("");
        },

        click: function() {
            hideAllUI();
            $("#cowsayui").show();
            $("#program").text("");
        },

        focus: function() {
            hideAllUI();
            $("#cowsayui").show();
            $("#program").text("");
        }
    });

    // Conway interface.
    $("#conwayfile").on({
        mouseenter: function() {
            hideAllUI();
            $("#name").text("app: conway.exe");
            $("#type").text("|--FILE->1609");
            $("#iteminfo").show();
        },

        mouseleave: function() {
            $("#iteminfo").hide();
        },

        click: function() {
            fullScreen("#conwayui");
            $("#conwayui").show();
            $("#program").text("conway.exe");
        },

        focus: function() {
            hideAllUI();
            $("#name").text("app: conway.exe");
            $("#type").text("|--FILE->1609");
            $("#iteminfo").show();
        },
    
        keyup: function(event) {
            if (event.key == "Enter") {
                fullScreen("#conwayui");
                $("#conwayui").show();
                $("#program").text("conway.exe");
            }
        }
    });

    // Wordsearch interface.
    $("#wordsearchfile").on({
        mouseenter: function() {
            hideAllUI();
            $("#name").text("app: wrdsrch.exe");
            $("#type").text("|--FILE->1505");
            $("#iteminfo").show();
        },

        mouseleave: function() {
            $("#iteminfo").hide();
        },

        click: function() {
            fullScreen("#wordsearchui");
            $("#wordsearchui").show();
            $("#program").text("wrdsrch.exe");
        },

        focus: function() {
            hideAllUI();
            $("#name").text("app: wrdsrch.exe");
            $("#type").text("|--FILE->1505");
            $("#iteminfo").show();
        },
    
        keyup: function(event) {
            if (event.key == "Enter") {
                fullScreen("#wordsearchui");
                $("#wordsearchui").show();
                $("#program").text("wrdsrch.exe");
            }
        }
    });

    // Quit interface.
    $("#quitfile").on({
        mouseenter: function() {
            hideAllUI();
            $("#name").text("app: quit.exe");
            $("#type").text("|--FILE->0192");
            $("#iteminfo").show();
        },

        mouseleave: function() {
            $("#iteminfo").hide();
        },

        click: function() {
            $("#quit").show();
        },

        focus: function() {
            hideAllUI();
            $("#name").text("app: quit.exe");
            $("#type").text("|--FILE->0192");
            $("#iteminfo").show();
        },
    
        keyup: function(event) {
            if (event.key == "Enter") {
                $("#quit").show();
            }
        }
    });

    // CIPHERS interface.
    $("#ciphersfolder").on({
        mouseenter: function() {
            hideAllUI();
            $("#name").text("directory:CIPHERS");
            $("#type").text("|>FOLDER<");
            $("#iteminfo").show();
        },

        mouseleave: function() {
            $("#iteminfo").hide();
        },

        click: function() {
            hideAllDirectories();
            hideAllUI();
            $("#ciphers").show();
            $("#directory").text("C:\\CIPHERS");
        },

        focus: function() {
            hideAllUI();
            $("#name").text("directory:CIPHERS");
            $("#type").text("|>FOLDER<");
            $("#iteminfo").show();
        },
    
        keyup: function(event) {
            if (event.key == "Enter") {
                hideAllDirectories();
                hideAllUI();
                $("#ciphers").show();
                $("#directory").text("C:\\CIPHERS");
            }
        }
    });

    // CIPHERS -> HOME interface.
    $("#cipherstohome").on({
        mouseenter: function() {
            hideAllUI();
            $("#name").text("directory:GO UP");
            $("#type").text("|>FOLDER<");
            $("#iteminfo").show();
        },

        mouseleave: function() {
            $("#iteminfo").hide();
        },

        click: function() {
            home();
        },

        focus: function() {
            hideAllUI();
            $("#name").text("directory:GO UP");
            $("#type").text("|>FOLDER<");
            $("#iteminfo").show();
        },
    
        keyup: function(event) {
            if (event.key == "Enter") {
                home();
            }
        }
    });

    // Affine interface.
    $("#affinefile").on({
        mouseenter: function() {
            hideAllUI();
            $("#name").text("app: affine.exe");
            $("#type").text("|--FILE->1201");
            $("#iteminfo").show();
        },

        mouseleave: function() {
            $("#iteminfo").hide();
        },

        click: function() {
            fullScreen("#affineui");
            $("#affineui").show();
            $("#program").text("affine.exe");
        },

        focus: function() {
            hideAllUI();
            $("#name").text("app: affine.exe");
            $("#type").text("|--FILE->1201");
            $("#iteminfo").show();
        },
    
        keyup: function(event) {
            if (event.key == "Enter") {
                fullScreen("#affineui");
                $("#affineui").show();
                $("#program").text("affine.exe");
            }
        }
    });

    // Vigenere interface.
    $("#vigenerefile").on({
        mouseenter: function() {
            hideAllUI();
            $("#name").text("app: vigenere.exe");
            $("#type").text("|--FILE->1314");
            $("#iteminfo").show();
        },

        mouseleave: function() {
            $("#iteminfo").hide();
        },

        click: function() {
            fullScreen("#vigenereui");
            $("#vigenereui").show();
            $("#program").text("vigenere.exe");
        },

        focus: function() {
            hideAllUI();
            $("#name").text("app: vigenere.exe");
            $("#type").text("|--FILE->1314");
            $("#iteminfo").show();
        },
    
        keyup: function(event) {
            if (event.key == "Enter") {
                fullScreen("#vigenereui");
                $("#vigenereui").show();
                $("#program").text("vigenere.exe");
            }
        }
    });

    // SETTINGS interface.
    $("#settingsfolder").on({
        mouseenter: function() {
            hideAllUI();
            $("#name").text("directory:SETTINGS");
            $("#type").text("|>FOLDER<");
            $("#iteminfo").show();
        },

        mouseleave: function() {
            $("#iteminfo").hide();
        },

        click: function() {
            hideAllDirectories();
            hideAllUI();
            $("#settings").show();
            $("#directory").text("C:\\SETTINGS");
        },

        focus: function() {
            hideAllUI();
            $("#name").text("directory:SETTINGS")
            $("#type").text("|>FOLDER<")
            $("#iteminfo").show();
        },
    
        keyup: function(event) {
            if (event.key == "Enter") {
                hideAllDirectories();
                hideAllUI();
                $("#settings").show();
                $("#directory").text("C:\\SETTINGS");
            }
        }
    });

    // SETTINGS -> HOME interface.
    $("#settingstohome").on({
        mouseenter: function() {
            hideAllUI();
            $("#name").text("directory:GO UP");
            $("#type").text("|>FOLDER<");
            $("#iteminfo").show();
        },

        mouseleave: function() {
            $("#iteminfo").hide();
        },

        click: function() {
            home();
        },

        focus: function() {
            hideAllUI();
            $("#name").text("directory:GO UP");
            $("#type").text("|>FOLDER<");
            $("#iteminfo").show();
        },
    
        keyup: function(event) {
            if (event.key == "Enter") {
                home();
            }
        }
    });

    // Theme interface.
    $("#themefile").on({
        mouseenter: function() {
            hideAllUI();
            $("#name").text("Switch between DARK and LIGHT themes");
            $("#type").text("");
            $("#iteminfo").show();
        },

        mouseleave: function() {
            $("#iteminfo").hide();
        },

        click: function() {
            toggleTheme();
        },

        focus: function() {
            hideAllUI();
            $("#name").text("Switch between DARK and LIGHT themes");
            $("#type").text("");
            $("#iteminfo").show();
        },
    
        keyup: function(event) {
            if (event.key == "Enter") {
                toggleTheme();
            }
        }
    });

    // Sound interface. Sound is off by default.
    $("#soundfile").on({
        mouseenter: function() {
            hideAllUI();
            $("#name").text("Turn sound ON or OFF");
            $("#type").text("");
            $("#iteminfo").show();
        },

        mouseleave: function() {
            $("#iteminfo").hide();
        },

        click: function() {
            toggleSound();
        },

        focus: function() {
            hideAllUI();
            $("#name").text("Turn sound ON or OFF");
            $("#type").text("");
            $("#iteminfo").show();
        },
    
        keyup: function(event) {
            if (event.key == "Enter") {
                toggleSound();
            }
        }
    });

    // Play ambience sound.
    // https://pixabay.com/sound-effects/computer-idle-ambient-loop-001-8420/
    function toggleSound() {
        if (soundEnabled == false) {
            $("audio")[0].volume = 0.2;
            $("audio").trigger("play");
            soundEnabled = true;
            $("#soundfile > .right").text(">" + "\xa0\xa0" + "ON" + "\xa0\xa0" + "<");
        }
        else {
            $("audio").trigger("pause");
            soundEnabled = false;
            $("#soundfile > .right").text("> OFF" + "\xa0\xa0" + "<");
        }
    }

    // Play a mouse click sound when the user clicks with their mouse.
    // https://pixabay.com/sound-effects/logitech-computer-mouse-click-95725/
    var clickSound = new Audio("../sounds/logitech-computer-mouse-click-95725.mp3")
    $(document).click(function() {
        if (soundEnabled)
            clickSound.play();
    });

    // Switch between dark and light modes.
    function toggleTheme() {
        if (!lightTheme && !($(":root").hasClass("light") || $(":root").hasClass("dark"))) {
            // Override automatic dark theme.
            $(":root").addClass("light");
            recordThemePreference("light");
            $("#themefile > .right").text(">LIGHT <");
        }
        else if (lightTheme && !($(":root").hasClass("light") || $(":root").hasClass("dark"))) {
            // Override automatic light theme.
            $(":root").addClass("dark");
            recordThemePreference("dark");
            $("#themefile > .right").text("> DARK <");
        }
        else if ($(":root").hasClass("light")) {
            $(":root").removeClass("light");
            $(":root").addClass("dark");
            recordThemePreference("dark");
            $("#themefile > .right").text("> DARK <");
        }
        else if ($(":root").hasClass("dark")) {
            $(":root").removeClass("dark");
            $(":root").addClass("light");
            recordThemePreference("light");
            $("#themefile > .right").text(">LIGHT <");
        }
    }

    // Store theme preference to local storage.
    function recordThemePreference(preference) {
        // Check browser support  .
        if (typeof(Storage) !== "undefined") {  
            // Store preference to local storage.  
            localStorage.setItem("theme", preference);  
        } 
        else {  
            // Local storage is unsupported.  
            $("#unsupported").text("Your browser does not support local storage");  
        } 
    }

    // Retrieve theme preference from local storage.
    function retrieveThemePreference() {
        // Check browser support  
        if (typeof(Storage) !== "undefined") {  
            // Get preference from local storage (values here are strings).
            return localStorage.getItem("theme");  
        } 
        else {  
            // Local storage is unsupported.  
            $("#unsupported").text("Your browser does not support local storage");
            return undefined; 
        } 
    }

    function setTheme() {
        var theme = retrieveThemePreference();

        if (theme == undefined) {
            return;
        }
        else {
            $(":root").removeClass("light");
            $(":root").removeClass("dark");
            $(":root").addClass(theme);
        }
    }

    // Show and hide names of logos on hover.
    $("#linkedin").hover(function() {
        $("#linkedin p").show();
    },
    function() {
        $("#linkedin p").hide();
    });

    $("#gitlab").hover(function() {
        $("#gitlab p").show();
    },
    function() {
        $("#gitlab p").hide();
    });

    $("#github").hover(function() {
        $("#github p").show();
    },
    function() {
        $("#github p").hide();
    });

    $("#discord").hover(function() {
        $("#discord p").show();
    },
    function() {
        $("#discord p").hide();
    });

    function fullScreen(id) {
        hideAllUI();
        $(id).show();
        $("div.content").addClass("fullscreen");
        $("#files").hide();
    }

    // Exiting "programs" and "folders".
    $(document).on("keydown", function(event) {
        if (event.key == "Escape" && ($("#ciphers").is(":visible") || $("#settings").is(":visible"))) {
            home();
        }
        else if (event.key == "Escape" && ($("#conwayui").is(":visible") || $("#wordsearchui").is(":visible"))) {
            // Want readme.txt to be shown by default in home "folder".
            $("#files").show();
            hideAllUI();
            $("#readmeui").show();
            $("div.content").removeClass("fullscreen");
            $("#program").text("");
        }
        else if (event.key == "Escape") {
            $("#files").show();
            hideAllUI();
            $("div.content").removeClass("fullscreen");
            $("#program").text("");
        }
    });

    function hideAllUI() {
        $("#iteminfo").hide();
        $("#readmeui").hide();
        $("#cowsayui").hide();
        $("#affineui").hide();
        $("#vigenereui").hide();
        $("#conwayui").hide();
        $("#wordsearchui").hide();
    }

    function hideAllDirectories() {
        $("#home").hide();
        $("#ciphers").hide();
        $("#settings").hide();
    }

    // Load and hide appropriate directories and UI to show transition to home 'folder'.
    function home() {
        hideAllDirectories();
        hideAllUI()
        $("#home").show();
        $("#readmeui").show();
        $("#program").text("");
        $("#directory").text("C:\\");
    }
});
