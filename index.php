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
        <link rel="stylesheet" href="jasmine/lib/jasmine-2.1.2/jasmine.css">
        <script src="jasmine/lib/jasmine-2.1.2/jasmine.js"></script>
        <script src="jasmine/lib/jasmine-2.1.2/jasmine-html.js"></script>
        <script src="jasmine/lib/jasmine-2.1.2/boot.js"></script>
    </head>
    <body>            
        <div><label class="label" for="input">Enter a number:</label></div>
        <textarea type="text" rows="4" id="input" name="input"></textarea>
        <input id="copy" class="crispbutton" style="margin-top:3px" type="submit" value="Copy">
        <input id="impress" class="crispbutton" style="margin-top:3px" type="submit" value="Impress Me">
        <div id="output"></div>
        <input id="copyThis" type="text" name="copyThis">
        <script src="jasmine/spec/feedreader.js"></script>
    </body>
</html>
