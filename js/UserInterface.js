/* 
 * All rights reserved. Copyright Robert Roy 2016.
 */

/**
 *
 * @author Robert Roy <www.robertsworkspace.com>
 */

$(document).ready(function () {
    var $input = $("#input");
    var $copyThis = $("#copyThis");
    var $output = $("#output");
    var $copy = $("#copy");

    // Reset fields so each refresh is a new page without previous cached inputs
    $input.val("");
    $copyThis.val("");

    $input.keypress(function (e) {
        // Prevents creating newlines in the input field
        if (e.keyCode === 13) {
            e.preventDefault();
        }
    });

    $("#impress").click(function () {
        // Generate a really long number and place it into the input field.
        var strNumber = "";
        //50% chance the number is negative
        if (Math.floor(Math.random() * 2) === 0) {
            strNumber = strNumber + "-";
        }
        // 3006 digits before the decimal, 3006 digits after.
        for (var i = 0; i < 3006; i++) {
            strNumber = strNumber + Math.floor(Math.random() * 10);
        }
        strNumber = strNumber + ".";
        for (var i = 0; i < 3006; i++) {
            strNumber = strNumber + Math.floor(Math.random() * 10);
        }
        // Place into input, fire .change() event so  changeInput() can run.
        $input.val(strNumber);
        $input.change();
    });

    $input.on("keyup paste change", function () {
        // wait one millisecond, fire changeInput() function
        setTimeout(changeInput($(this)), 1);
    });

    $copy.click(function () {
        // Have user select a hidden input, highlight the hidden input's text,
        // then run the copy command. Update the button accordingly.
        var target = document.getElementById("copyThis");
        target.setSelectionRange(0, target.value.length);
        $copyThis.focus();
        // Move the window back to the top of the screen instead of jumping to the hidden element
        window.scrollTo(0, 0);
        try {
            document.execCommand("copy");
            $copy.val("Copied!");
        } catch (e) {
            $copy.val("An Error Occurred");
        }
        $copy.focus();
    });

    function changeInput(that) {
        // Whenever the input is changed, this is fired.
        // It attempts to convert (function must be provided by another file).
        // The return from the convert() function is placed into $output.html and
        // copyThis (a hidden input used for copying).

        var output = convert(that.val());
        $output.html(output);
        $copyThis.val(output);
        if (that.val() === "") {
            $output.html("");
        }
        // Rename copy function to its original text, just in case it was modified
        // Because the button was pressed for any reason.
        $copy.val("Copy");
    }
});

