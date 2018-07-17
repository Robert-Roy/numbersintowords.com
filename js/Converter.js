/* 
 * All rights reserved. Copyright Robert Roy 2018.
 */

function convert(input) {
    if (!isValid(input)) {
        return "Invalid Input";
    }
    var decimalIndex; // where in input the decimal is
    var output = "";
    var strNegative = ""; // added to output later
    if (isNegative(input)) {
        strNegative = "negative ";
        input = input.substring(1, input.length); // trim "-"
    }
    decimalIndex = input.indexOf(".");
    if (decimalIndex === -1) {
        output = getConvertedString(input, false); // convert input
    } else {
        // split string at decimal
        var strPredecimal = input.substring(0, decimalIndex);
        var strPostdecimal = input.substring(decimalIndex + 1, input.length);
        // convert both strings
        //VALID TO HERE
        strPredecimal = getConvertedString(strPredecimal, false);
        strPostdecimal = getConvertedString(strPostdecimal, true);
        if (strPredecimal === "zero" && strPostdecimal.length !== 0) {
            output = strPostdecimal; // only post decimal stuff
        } else if (strPredecimal.length !== 0 && strPostdecimal.length !== 0) {
            output = strPredecimal + " and " + strPostdecimal; // pre and post decimal stuff
        } else {
            output = strPredecimal; // only predecimal stuff
        }
    }
    output = strNegative + output;
    return output;
}

function getConvertedString(strConvert, blnFraction) {

    //VALID TO HERE
    var blnFractionSelected = false;
    var strFraction = "";
    var retval = "";
    while (!(strConvert === "")) {
        //Note: There are no commas in the input at this point, comma is only
        //used for ease of reference
        //number of commas that would be in the number written out
        var commas = Math.floor((strConvert.length - 1) / 3);
        //everything before the comma (or end, if there is not one)
        var precomma = strConvert.length % 3;
        // input without length cannot get to this point, so 0 is always 3
        if (precomma === 0) {
            precomma = 3;
        }
        if (blnFraction && !blnFractionSelected) {
            // find the appropriate fraction for post-decimal text
            var nextUnit = 0;
            switch (precomma) {
                case 1:
                    strFraction = " ten";
                    break;
                case 2:
                    strFraction = " hundred";
                    break;
                case 3:
                    nextUnit = 1;
            }
            var unit = arabicNumeralUnits[commas + nextUnit].trim();
            if (unit.length > 0) {
                try {
                    var value = parseInt(strConvert);
                    if (value === 1) {
                        strFraction = strFraction + " " + unit + "th";
                    } else {
                        strFraction = strFraction + " " + unit + "ths";
                    }
                } catch (ex) {
                    strFraction = strFraction + " " + unit + "ths";
                }
            } else {
                try {
                    var value = parseInt(strConvert);
                    if (value === 1) {
                        strFraction = strFraction + "th";
                    } else {
                        strFraction = strFraction + "ths";
                    }
                } catch (ex) {
                    strFraction = strFraction + "ths";

                }
            }
            blnFractionSelected = true;
        }
        // substring of everything before the comma
        var strThisUnit = strConvert.substring(0, precomma);

        //loop trims zeroes at the beginning of numbers
        for (var a = 0; a < strThisUnit.length; a++) {
            if (strThisUnit.substring(a, a + 1) === "0") {
                // remove first letter of string
                strThisUnit = strThisUnit.substring(a + 1, strThisUnit.length);
                // move counter back
                a--;
            } else {
                // if a nonzero number is hit, output is created
                retval = retval + wordsFromNum(strThisUnit) + arabicNumeralUnits[commas];
                break;
            }
        }
        // input is cut shorter to remove addressed portion
        strConvert = strConvert.substring(precomma, strConvert.length);
    }

    if (retval === "") {
        retval = "zero"; // if no output has been added yet, result is zero
    }
    retval = replaceAll(retval, "  ", " "); // remove doublespaces
    retval = retval.trim(); // remove trailing spaces
    if (blnFraction && !(strFraction === "")) {
        return retval + strFraction;
    } else if (blnFraction) {
        return "";
    } else {
        return retval;
    }
}

function wordsFromNum(strInput) {
    // return anything 0-19
    switch (strInput) {
        case "0":
            return "";
        case "1":
            return "one";
        case "2":
            return "two";
        case "3":
            return "three";
        case "4":
            return "four";
        case "5":
            return "five";
        case "6":
            return "six";
        case "7":
            return "seven";
        case "8":
            return "eight";
        case "9":
            return "nine";
        case "10":
            return "ten";
        case "11":
            return "eleven";
        case "12":
            return "twelve";
        case "13":
            return "thirteen";
        case "14":
            return "fourteen";
        case "15":
            return "fifteen";
        case "16":
            return "sixteen";
        case "17":
            return "seventeen";
        case "18":
            return "eighteen";
        case "19":
            return "nineteen";
    }
    var retval = ""; //return value
    switch (strInput.length) {
        case 2:
            // input >= 20, so must get tens and ones separate
            retval = tens(strInput.substring(0, 1));
            // num = XY, if X and Y are not zero, we need a hyphen
            if (!(strInput.substring(1, 2) === "0") && !(strInput.substring(0, 1) === "0")) {
                retval = retval + "-";
            }
            // recurse for ones
            retval = retval + wordsFromNum(strInput.substring(1, 2));
            return retval;
        case 3:
            // recurse for first digit
            retval = wordsFromNum(strInput.substring(0, 1)) + " hundred ";
            // recurse for remaining two digit number
            var strones = strInput.substring(1, 3);
            retval = retval + wordsFromNum(strones);
            return retval;
        default:
            // should be unreachable, but just in case
            return " ERROR ";
    }
}

function tens(input) {
    switch (input) {
        case "2":
            return "twenty";
        case "3":
            return "thirty";
        case "4":
            return "forty";
        case "5":
            return "fifty";
        case "6":
            return "sixty";
        case "7":
            return "seventy";
        case "8":
            return "eighty";
        case "9":
            return "ninety";
        default:
            return "";
    }
}

function isValid(input) {
    if (input === "" || input === "-0") {
        return false;
    }
    if (input.includes('-')) {
        if (!(input.includes('1') ||
                input.includes('2') ||
                input.includes('3') ||
                input.includes('4') ||
                input.includes('5') ||
                input.includes('6') ||
                input.includes('7') ||
                input.includes('8') ||
                input.includes('9'))) {
            return false;

        }
    }
    if (input.indexOf('--') > -1) {
        return false;
    }
    if (isNegative(input)) {
        input = input.substring(1, input.length); // trim "-"
    }
    if (!isNumeric(input)) {
        return false;
    }
    var decimalIndex = 0;
    decimalIndex = input.indexOf(".");
    if (decimalIndex === -1 && input.length < 3007) {
        return true;
    } else {
        var strPredecimal = input.substring(0, decimalIndex);
        var strPostdecimal = input.substring(decimalIndex + 1, input.length);
        if (strPredecimal.length + strPostdecimal.length === 0) { //"."
            return false;
        } else if (strPredecimal.length < 3007 && strPostdecimal.length < 3007) { // valid length
            return true;
        } else {
            return false; // invalid length
        }
    }
}

function isNegative(input) {
    if (input.substring(0, 1) === "-") {
        return true;
    }
    return false;
}

function isNumeric(input) {
    var ALLOWED_DECIMALS = 1; //maximum number of decimals. 0 for ints, 1 for other
    var decimals = 0; //counter
    if (input.length === 0) {
        return false; // "" is not numeric
    }
    for (var i = 0; i < input.length; i++) {
        switch (input.substring(i, i + 1)) {
            case "-":
                if (i === 0) {
                    break;
                } else {
                    return false;
                }
            case "0":
                break;
            case "1":
                break;
            case "2":
                break;
            case "3":
                break;
            case "4":
                break;
            case "5":
                break;
            case "6":
                break;
            case "7":
                break;
            case "8":
                break;
            case "9":
                break;
            case ".":
                decimals++;
                if (decimals > ALLOWED_DECIMALS) {
                    return false;
                }
                break;
            default:
                // if we got here, input was not numeric
                return false;
        }
    }
    return true;
}

function replaceAll(searchThis, findThis, replaceWithThis) {
    return searchThis.split(findThis).join(replaceWithThis);
}
;