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

    $input.val("");
    $copyThis.val("");

    $input.keypress(function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
        } else {
        }
    });

    $("#impress").click(function () {
        var strNumber = "";
        if (Math.floor(Math.random() * 2) === 0) {
            strNumber = strNumber + "-";
        }
        for (var i = 0; i < 3006; i++) {
            strNumber = strNumber + Math.floor(Math.random() * 10);
        }
        strNumber = strNumber + ".";
        for (var i = 0; i < 3006; i++) {
            strNumber = strNumber + Math.floor(Math.random() * 10);
        }
        $input.val(strNumber);
        $input.change();
    });

    $input.on("keyup paste change", function () {
        setTimeout(changeInput($(this)), 1);
    });

    $copy.click(function () {
        var target = document.getElementById("copyThis");
        target.setSelectionRange(0, target.value.length);
        $copyThis.focus();
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
        var output = tryConvert(that.val());
        $output.html(output);
        $copyThis.val(output);
        if (that.val() === "") {
            $output.html("");
        }
        ;
        $copy.val("Copy");
    }
});

