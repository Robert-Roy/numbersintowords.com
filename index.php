<!DOCTYPE html>
<!--
All rights reserved. Copyright Robert Roy 2016.
-->
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Numbers Into Words</title>
        <link rel="stylesheet" href="default.css">
        <script src="lib/jquery/jquery-3.3.1.min.js"></script>
        <script src="js/ArabicNumeralUnits.js"></script>
        <script src="js/UserInterface.js"></script>
        <script src="js/Converter.js"></script>
        <link rel="stylesheet" href="lib/jasmine/jasmine-3.1.0/jasmine.css">
        <script src="lib/jasmine/jasmine-3.1.0/jasmine.js"></script>
        <script src="lib/jasmine/jasmine-3.1.0/jasmine-html.js"></script>
        <script src="lib/jasmine/jasmine-3.1.0/boot.js"></script>
    </head>
    <body>            
        <div id="main">
            <div><label class="label" for="input">Enter a number:</label></div>
            <textarea type="text" rows="4" id="input" name="input"></textarea>
            <input id="copy" class="crispbutton" style="margin-top:3px" type="submit" value="Copy">
            <input id="impress" class="crispbutton" style="margin-top:3px" type="submit" value="Impress Me">
            <div id="output"></div>
            <input id="copyThis" type="text" name="copyThis">
        </div>
        <script src="lib/jasmine/spec/feedreader.js"></script>
    </body>
</html>
