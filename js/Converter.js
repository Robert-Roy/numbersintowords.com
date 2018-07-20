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
        // trim single "-" off the left side
        input = input.substring(1, input.length);
    }
    decimalIndex = input.indexOf(".");
    if (decimalIndex === -1) {
        output = getConvertedString(input); // convert input
    } else {
        // split string at decimal
        var strPredecimal = input.substring(0, decimalIndex);
        var strPostdecimal = input.substring(decimalIndex + 1, input.length);
        //convert both strings separately
        var strConvertedPredecimal = getConvertedString(strPredecimal);
        var strConvertedPostdecimal = getConvertedString(strPostdecimal);
        var strPostdecimalUnit = getFractionalUnit(strPostdecimal);
        if (strConvertedPredecimal === "zero" && strPostdecimal.length !== 0) {
            // EX: "0.1" (zero and one tenth, the zero should be not be written)
            output = strConvertedPostdecimal + " " + strPostdecimalUnit; 
        } else if (strPredecimal.length !== 0 && strPostdecimal.length !== 0) {
            // EX: "1.1" (one and one tenth) Zeroes beyond the decimal are significant
            // figures and should be noted
            output = strConvertedPredecimal + " and " + strConvertedPostdecimal + " " + strPostdecimalUnit; // pre and post decimal stuff
        } else {
            // EX "1."
            output = strConvertedPredecimal; // only predecimal stuff
        }
    }
    output = strNegative + output;
    return output;
}

function getFractionalUnit(strPercentageAsDecimal) {
    // find the appropriate fraction for post-decimal text
    var strFraction = "";
    // If there is no number, return no unit.
    if(strPercentageAsDecimal === ""){
        return "";
    }
    //Note: There are no commas in the input at this point, comma is only
    //used for ease of reference
    //number of commas that would be in the number written out
    var commas = Math.floor((strPercentageAsDecimal.length - 1) / 3);
    //everything before the comma (or end, if there is not one)
    var precomma = strPercentageAsDecimal.length % 3;
    // .000,000 should be considered 3, not 0
    if (precomma === 0) {
        precomma = 3;
    }
    var nextUnit = 0;
    // EXAMPLES: .000 or .000000 = 3
    // .00 or .00000 = 2
    // .0 or .0000 = 1
    switch (precomma) {
        case 1:
            strFraction = "ten"; // as in TEN thousanth
            break;
        case 2:
            strFraction = "hundred"; // as in HUNDRED thousandth
            break;
        case 3:
            // in this case you don't say "THOUSAND thousandth, you say millionth
            // This number is used on the next line
            nextUnit = 1;
    }
    // for each 3 characters in the number, you go one arabic unit higher.
    // thousand, million, billion, etc. Go one extra if precomma = 3.
    var unit = arabicNumeralUnits[commas + nextUnit].trim();
    if (unit.length > 0) { // if unit is thousand or greater instead of ""
        // add a space if adding "hundred" to "thousandth"
        if(strFraction.length > 0){
            strFraction = strFraction + " ";
        }
        strFraction = strFraction + unit + "th"; //one ten thousandth
    } else {
        // if unit is "", then we should get something like tenTH or hundredTH.
        strFraction = strFraction + "th"; // as in 
    }
    // attempt to ."0000001" to one. If it is anything else, the fractional unit is pluralised
    if (strPercentageAsDecimal != 1) {
        strFraction = strFraction + "s";
    }
    return strFraction;
}

function getConvertedString(strConvert) {
    // Converts an input string to numerical output EX 3 to "three"
    var retval = "";
    // "" should return ""
    if(strConvert === ""){
        return retval;
    }
    while (!(strConvert === "")) {
        //Note: There are no commas in the input at this point, comma is only
        //used for ease of reference
        //number of commas that would be in the number written out
        var commas = Math.floor((strConvert.length - 1) / 3);
        //everything before the comma (or end, if there is not one)
        var precomma = strConvert.length % 3;
        // 300,000 should be considered 3, not 0
        if (precomma === 0) {
            precomma = 3;
        }
        // substring of everything before the comma
        var strThisUnit = strConvert.substring(0, precomma);
        // substring of everything after the comma overwrites original string
        strConvert = strConvert.substring(precomma, strConvert.length);

        //Go through each number "030"
        for (var a = 0; a < strThisUnit.length; a++) {
            if (strThisUnit[a] === "0") {
                // remove first letter of string
                strThisUnit = strThisUnit.substring(a + 1, strThisUnit.length);
                // move counter back to reiterate over same index
                a--;
            } else {
                // if a nonzero number is hit, output is created
                // "30" or "300" might get here, but "030" will not.
                retval = retval + wordsForNum(strThisUnit) + arabicNumeralUnits[commas];
                break;
            }
        }
    }
    // because of the way zeroes are handled, a string of 000000000000000000000000
    // will cause retval to be "" at this point. It should be 0
    if (retval === "") {
        retval = "zero"; 
    }
    retval = replaceAll(retval, "  ", " "); // remove doublespaces
    retval = retval.trim(); // remove trailing spaces
    return retval;
}

function wordsForNum(strInput) {
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
    switch (strInput.length) {
        case 2:
            // 20 <= input <= 99, so must get tens and ones separate
            var strTens = tens(strInput[0]);
            // recurse for ones
            var strOnes = wordsForNum(strInput[1]);
            // num = XY, if X and Y are not zero (zero is evaluated as ""), 
            // we need a hyphen EX: fifty or five vs fifty-five
            if (strTens !== "" && strOnes !== "") {
                return strTens + "-" + strOnes;
            }
            // at least one of these strings will be "".
            return strTens + strOnes;
        case 3:
            // 100 <= input <= 999;
            // recurse for first digit [1]00 = "one hundred"
            var strHundreds = wordsForNum(strInput[0]) + " hundred ";
            // recurse for remaining two digit number
            var strTensAndOnes = wordsForNum(strInput.substring(1, 3));
            return strHundreds + strTensAndOnes;
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
    // The maximum number of characters that can be evaluated as a number
    // by this program right now.
    let maxNumChars = 3006;
    // Numbers only
    if (!isNumeric(input)) {
        return false;
    }
    // If numbers is negative, remove the negative sign.
    if (isNegative(input)) {
        input = input.substring(1, input.length);
    }
    var decimalIndex = input.indexOf(".");
    if (decimalIndex === -1 && input.length > maxNumChars) {
        // if there is no decimal and the string is too long, return false
        return false;
    } else {
        // There is a decimal point. This verifies that the length of the strings
        // Before and After the decimal point are less than or equal to maxNumChars.
        var strPredecimal = input.substring(0, decimalIndex);
        var strPostdecimal = input.substring(decimalIndex + 1, input.length);
        if (strPredecimal.length > maxNumChars || strPostdecimal.length > maxNumChars) {
            return false;
        }
        // Return false on "."
        if (strPredecimal.length + strPostdecimal.length === 0) {
            return false;
        }
        // If we have not returned false yet, string is valid.
        return true;
    }
}

function isNegative(input) {
    if (input.indexOf("-") === 0) {
        return true;
    }
    return false;
}

function isNumeric(input) {

    // According to this function, anything with one or fewer "."s and one or fewer "-"s,
    // and only number characters "1234567890" is a number. The "-" must be the leftmost
    // character. Negative zeroes are also not allowed.

    var ALLOWED_DECIMALS = 1; //maximum number of decimals. 0 for ints, 1 for other
    var decimals = 0; //counter
    if (input.length === 0) {
        return false; // "" is not numeric
    }
    for (var i = 0; i < input.length; i++) {
        switch (input[i]) {
            case "-":
                // "-" is only appropriate as the leftmost character.
                if (i === 0) {
                    // No negative zeroes
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
                    // too many "."s
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
    // Replaces all instaces of findThis in searchThis with replaceWithThis
    return searchThis.split(findThis).join(replaceWithThis);
}