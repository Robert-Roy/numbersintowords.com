/* 
 * All rights reserved. Copyright Robert Roy 2016.
 */

/**
 *
 * @author Robert Roy <www.robertsworkspace.com>
 */

$(document).ready(function () {
    $("#input").val("");
    $("#input").keypress(function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
        } else {
        }
    });
    $("#input").keyup(function () {
        $("#output").html(tryConvert($(this).val()));
    });
});

function tryConvert(value) {
    return convert(value);
}

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
        var commas = Math.trunc((strConvert.length - 1) / 3);
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
            var unit = units[commas + nextUnit].trim();
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
                retval = retval + wordsFromNum(strThisUnit) + units[commas];
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
    if (input === "") {
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
var units = [
    "",
    " thousand ",
    " million ",
    " billion ",
    " trillion ",
    " quadrillion ",
    " quintillion ",
    " sextillion ",
    " septillion ",
    " octillion ",
    " nonillion ",
    " decillion ",
    " undecillion ",
    " duodecillion ",
    " tredecillion ",
    " quattuordecillion ",
    " quindecillion ",
    " sedecillion ",
    " septendecillion ",
    " octodecillion ",
    " novendecillion ",
    " vigintillion ",
    " unvigintillion ",
    " duovigintillion ",
    " tresvigintillion ",
    " quattuorvigintillion ",
    " quinvigintillion ",
    " sesvigintillion ",
    " septemvigintillion ",
    " octovigintillion ",
    " novemvigintillion ",
    " trigintillion ",
    " untrigintillion ",
    " duotrigintillion ",
    " trestrigintillion ",
    " quattuortrigintillion ",
    " quintrigintillion ",
    " sestrigintillion ",
    " septentrigintillion ",
    " octotrigintillion ",
    " noventrigintillion ",
    " quadragintillion ",
    " unquadragintillion ",
    " duoquadragintillion ",
    " tresquadragintillion ",
    " quattuorquadragintillion ",
    " quindragintillion ",
    " sesquadragintillion ",
    " septenquadragintillion ",
    " octoquadragintillion ",
    " novenquadragintillion ",
    " quinquagintillion ",
    " unquinquagintillion ",
    " duoquinquagintillion ",
    " tresquinquagintillion ",
    " quattuorquinquagintillion ",
    " quinquinquagintillion ",
    " sesquinquagintillion ",
    " septenquinquagintillion ",
    " octoquinquagintillion ",
    " novenquinquagintillion ",
    " sexagintillion ",
    " unsexagintillion ",
    " duosexagintillion ",
    " tresexagintillion ",
    " quattuorsexagintillion ",
    " quinsexagintillion ",
    " sesexagintillion ",
    " septensexagintillion ",
    " octosexagintillion ",
    " novensexagintillion ",
    " septuagintillion ",
    " unseptuagintillion ",
    " duoseptuagintillion ",
    " treseptuagintillion ",
    " quattuorseptuagintillion ",
    " quinseptuagintillion ",
    " seseptuagintillion ",
    " septenseptuagintillion ",
    " octoseptuagintillion ",
    " novenseptuagintillion ",
    " octogintillion ",
    " unoctogintillion ",
    " duooctogintillion ",
    " tresoctogintillion ",
    " quattuoroctogintillion ",
    " quinoctogintillion ",
    " sexoctogintillion ",
    " septemoctogintillion ",
    " octooctogintillion ",
    " novemoctogintillion ",
    " nonagintillion ",
    " unnonagintillion ",
    " duononagintillion ",
    " trenonagintillion ",
    " quattuornonagintillion ",
    " quinnonagintillion ",
    " sexnonagintillion ",
    " septenonagintillion ",
    " octononagintillion ",
    " novenonagintillion ",
    " centillion ",
    " uncentillion ",
    " duocentillion ",
    " trescentillion ",
    " quattuorcentillion ",
    " quincentillion ",
    " sexcentillion ",
    " septencentillion ",
    " octocentillion ",
    " novencentillion ",
    " decicentillion ",
    " undecicentillion ",
    " duodecicentillion ",
    " tredecicentillion ",
    " quattuordecicentillion ",
    " quindecicentillion ",
    " sedecicentillion ",
    " septendecicentillion ",
    " octodecicentillion ",
    " novendecicentillion ",
    " viginticentillion ",
    " unviginticentillion ",
    " duoviginticentillion ",
    " tresviginticentillion ",
    " quattuorviginticentillion ",
    " quinviginticentillion ",
    " sesviginticentillion ",
    " septemviginticentillion ",
    " octoviginticentillion ",
    " novemviginticentillion ",
    " trigintacentillion ",
    " untrigintacentillion ",
    " duotrigintacentillion ",
    " trestrigintacentillion ",
    " quattuortrigintacentillion ",
    " quintrigintacentillion ",
    " sestrigintacentillion ",
    " septentrigintacentillion ",
    " octotrigintacentillion ",
    " noventrigintacentillion ",
    " quadragintacentillion ",
    " unquadragintacentillion ",
    " duoquadragintacentillion ",
    " tresquadragintacentillion ",
    " quattuorquadragintacentillion ",
    " quinquadragintacentillion ",
    " sesquadragintacentillion ",
    " septenquadragintacentillion ",
    " octoquadragintacentillion ",
    " novenquadragintacentillion ",
    " quinquagintacentillion ",
    " unquinquagintacentillion ",
    " duoquinquagintacentillion ",
    " tresquinquagintacentillion ",
    " quattuorquinquagintacentillion ",
    " quinquinquagintacentillion ",
    " sesquinquagintacentillion ",
    " septenquinquagintacentillion ",
    " octoquinquagintacentillion ",
    " novenquinquagintacentillion ",
    " sexagintacentillion ",
    " unsexagintacentillion ",
    " duosexagintacentillion ",
    " tresexagintacentillion ",
    " quattuorsexagintacentillion ",
    " quinsexagintacentillion ",
    " sesexagintacentillion ",
    " septensexagintacentillion ",
    " octosexagintacentillion ",
    " novensexagintacentillion ",
    " septuagintacentillion ",
    " unseptuagintacentillion ",
    " duoseptuagintacentillion ",
    " treseptuagintacentillion ",
    " quattuorseptuagintacentillion ",
    " quinseptuagintacentillion ",
    " seseptuagintacentillion ",
    " septenseptuagintacentillion ",
    " octoseptuagintacentillion ",
    " novenseptuagintacentillion ",
    " octogintacentillion ",
    " unoctogintacentillion ",
    " duooctogintacentillion ",
    " tresoctogintacentillion ",
    " quattuoroctogintacentillion ",
    " quinoctogintacentillion ",
    " sexoctogintacentillion ",
    " septemoctogintacentillion ",
    " octooctogintacentillion ",
    " novemoctogintacentillion ",
    " nonagintacentillion ",
    " unnonagintacentillion ",
    " duononagintacentillion ",
    " trenonagintacentillion ",
    " quattuornonagintacentillion ",
    " quinnonagintacentillion ",
    " senonagintacentillion ",
    " septenonagintacentillion ",
    " octononagintacentillion ",
    " novenonagintacentillion ",
    " ducentillion ",
    " unducentillion ",
    " duoducentillion ",
    " treducentillion ",
    " quattuorducentillion ",
    " quinducentillion ",
    " seducentillion ",
    " septenducentillion ",
    " octoducentillion ",
    " novenducentillion ",
    " deciducentillion ",
    " undeciducentillion ",
    " duodeciducentillion ",
    " tredeciducentillion ",
    " quattuordeciducentillion ",
    " quindeciducentillion ",
    " sedeciducentillion ",
    " septendeciducentillion ",
    " octodeciducentillion ",
    " novendeciducentillion ",
    " vigintiducentillion ",
    " unvigintiducentillion ",
    " duovigintiducentillion ",
    " tresvigintiducentillion ",
    " quattuorvigintiducentillion ",
    " quinvigintiducentillion ",
    " sesvigintiducentillion ",
    " septemvigintiducentillion ",
    " octovigintiducentillion ",
    " novemvigintiducentillion ",
    " trigintaducentillion ",
    " untrigintaducentillion ",
    " duotrigintaducentillion ",
    " trestrigintaducentillion ",
    " quattuortrigintaducentillion ",
    " quintrigintaducentillion ",
    " sestrigintaducentillion ",
    " septentrigintaducentillion ",
    " octotrigintaducentillion ",
    " noventrigintaducentillion ",
    " quadragintaducentillion ",
    " unquadragintaducentillion ",
    " duoquadragintaducentillion ",
    " tresquadragintaducentillion ",
    " quattuorquadragintaducentillion ",
    " quinquadragintaducentillion ",
    " sesquadragintaducentillion ",
    " septenquadragintaducentillion ",
    " octoquadragintaducentillion ",
    " novenquadragintaducentillion ",
    " quinquagintaducentillion ",
    " unquinquagintaducentillion ",
    " duoquinquagintaducentillion ",
    " tresquinquagintaducentillion ",
    " quattuorquinquagintaducentillion ",
    " quinquinquagintaducentillion ",
    " sesquinquagintaducentillion ",
    " septenquinquagintaducentillion ",
    " octoquinquagintaducentillion ",
    " novenquinquagintaducentillion ",
    " sexagintaducentillion ",
    " unsexagintaducentillion ",
    " duosexagintaducentillion ",
    " tresexagintaducentillion ",
    " quattuorsexagintaducentillion ",
    " quinsexagintaducentillion ",
    " sesexagintaducentillion ",
    " septensexagintaducentillion ",
    " octosexagintaducentillion ",
    " novensexagintaducentillion ",
    " septuagintaducentillion ",
    " unseptuagintaducentillion ",
    " duoseptuagintaducentillion ",
    " treseptuagintaducentillion ",
    " quattuorseptuagintaducentillion ",
    " quinseptuagintaducentillion ",
    " seseptuagintaducentillion ",
    " septenseptuagintaducentillion ",
    " octoseptuagintaducentillion ",
    " novenseptuagintaducentillion ",
    " octogintaducentillion ",
    " unoctogintaducentillion ",
    " duooctogintaducentillion ",
    " tresoctogintaducentillion ",
    " quattuoroctogintaducentillion ",
    " quinoctogintaducentillion ",
    " sexoctogintaducentillion ",
    " septemoctogintaducentillion ",
    " octooctogintaducentillion ",
    " novemoctogintaducentillion ",
    " nonagintaducentillion ",
    " unnonagintaducentillion ",
    " duononagintaducentillion ",
    " trenonagintaducentillion ",
    " quattuornonagintaducentillion ",
    " quinnonagintaducentillion ",
    " senonagintaducentillion ",
    " septenonagintaducentillion ",
    " octononagintaducentillion ",
    " novenonagintaducentillion ",
    " trecentillion ",
    " untrecentillion ",
    " duotrecentillion ",
    " trestrecentillion ",
    " quattuortrecentillion ",
    " quintrecentillion ",
    " sestrecentillion ",
    " septentrecentillion ",
    " octotrecentillion ",
    " noventrecentillion ",
    " decitrecentillion ",
    " undecitrecentillion ",
    " duodecitrecentillion ",
    " tredecitrecentillion ",
    " quattuordecitrecentillion ",
    " quindecitrecentillion ",
    " sedecitrecentillion ",
    " septendecitrecentillion ",
    " octodecitrecentillion ",
    " novendecitrecentillion ",
    " vigintitrecentillion ",
    " unvigintitrecentillion ",
    " duovigintitrecentillion ",
    " tresvigintitrecentillion ",
    " quattuorvigintitrecentillion ",
    " quinvigintitrecentillion ",
    " sesvigintitrecentillion ",
    " septemvigintitrecentillion ",
    " octovigintitrecentillion ",
    " novemvigintitrecentillion ",
    " trigintatrecentillion ",
    " untrigintatrecentillion ",
    " duotrigintatrecentillion ",
    " trestrigintatrecentillion ",
    " quattuortrigintatrecentillion ",
    " quintrigintatrecentillion ",
    " sestrigintatrecentillion ",
    " septentrigintatrecentillion ",
    " octotrigintatrecentillion ",
    " noventrigintatrecentillion ",
    " quadragintatrecentillion ",
    " unquadragintatrecentillion ",
    " duoquadragintatrecentillion ",
    " tresquadragintatrecentillion ",
    " quattuorquadragintatrecentillion ",
    " quinquadragintatrecentillion ",
    " sesquadragintatrecentillion ",
    " septenquadragintatrecentillion ",
    " octoquadragintatrecentillion ",
    " novenquadragintatrecentillion ",
    " quinquagintatrecentillion ",
    " unquinquagintatrecentillion ",
    " duoquinquagintatrecentillion ",
    " tresquinquagintatrecentillion ",
    " quattuorquinquagintatrecentillion ",
    " quinquinquagintatrecentillion ",
    " sesquinquagintatrecentillion ",
    " septenquinquagintatrecentillion ",
    " octoquinquagintatrecentillion ",
    " novenquinquagintatrecentillion ",
    " sexagintatrecentillion ",
    " unsexagintatrecentillion ",
    " duosexagintatrecentillion ",
    " tresexagintatrecentillion ",
    " quattuorsexagintatrecentillion ",
    " quinsexagintatrecentillion ",
    " sesexagintatrecentillion ",
    " septensexagintatrecentillion ",
    " octosexagintatrecentillion ",
    " novensexagintatrecentillion ",
    " septuagintatrecentillion ",
    " unseptuagintatrecentillion ",
    " duoseptuagintatrecentillion ",
    " treseptuagintatrecentillion ",
    " quattuorseptuagintatrecentillion ",
    " quinseptuagintatrecentillion ",
    " seseptuagintatrecentillion ",
    " septenseptuagintatrecentillion ",
    " octoseptuagintatrecentillion ",
    " novenseptuagintatrecentillion ",
    " octogintatrecentillion ",
    " unoctogintatrecentillion ",
    " duooctogintatrecentillion ",
    " tresoctogintatrecentillion ",
    " quattuoroctogintatrecentillion ",
    " quinoctogintatrecentillion ",
    " sexoctogintatrecentillion ",
    " septemoctogintatrecentillion ",
    " octooctogintatrecentillion ",
    " novemoctogintatrecentillion ",
    " nonagintatrecentillion ",
    " unnonagintatrecentillion ",
    " duononagintatrecentillion ",
    " trenonagintatrecentillion ",
    " quattuornonagintatrecentillion ",
    " quinnonagintatrecentillion ",
    " senonagintatrecentillion ",
    " septenonagintatrecentillion ",
    " octononagintatrecentillion ",
    " novenonagintatrecentillion ",
    " quadringentillion ",
    " unquadringentillion ",
    " duoquadringentillion ",
    " tresquadringentillion ",
    " quattuorquadringentillion ",
    " quinquadringentillion ",
    " sesquadringentillion ",
    " septenquadringentillion ",
    " octoquadringentillion ",
    " novenquadringentillion ",
    " deciquadringentillion ",
    " undeciquadringentillion ",
    " duodeciquadringentillion ",
    " tredeciquadringentillion ",
    " quattuordeciquadringentillion ",
    " quindeciquadringentillion ",
    " sedeciquadringentillion ",
    " septendeciquadringentillion ",
    " octodeciquadringentillion ",
    " novendeciquadringentillion ",
    " vigintiquadringentillion ",
    " unvigintiquadringentillion ",
    " duovigintiquadringentillion ",
    " tresvigintiquadringentillion ",
    " quattuorvigintiquadringentillion ",
    " quinvigintiquadringentillion ",
    " sesvigintiquadringentillion ",
    " septemvigintiquadringentillion ",
    " octovigintiquadringentillion ",
    " novemvigintiquadringentillion ",
    " trigintaquadringentillion ",
    " untrigintaquadringentillion ",
    " duotrigintaquadringentillion ",
    " trestrigintaquadringentillion ",
    " quattuortrigintaquadringentillion ",
    " quintrigintaquadringentillion ",
    " sestrigintaquadringentillion ",
    " septentrigintaquadringentillion ",
    " octotrigintaquadringentillion ",
    " noventrigintaquadringentillion ",
    " quadragintaquadringentillion ",
    " unquadragintaquadringentillion ",
    " duoquadragintaquadringentillion ",
    " tresquadragintaquadringentillion ",
    " quattuorquadragintaquadringentillion ",
    " quinquadragintaquadringentillion ",
    " sesquadragintaquadringentillion ",
    " septenquadragintaquadringentillion ",
    " octoquadragintaquadringentillion ",
    " novenquadragintaquadringentillion ",
    " quinquagintaquadringentillion ",
    " unquinquagintaquadringentillion ",
    " duoquinquagintaquadringentillion ",
    " tresquinquagintaquadringentillion ",
    " quattuorquinquagintaquadringentillion ",
    " quinquinquagintaquadringentillion ",
    " sesquinquagintaquadringentillion ",
    " septenquinquagintaquadringentillion ",
    " octoquinquagintaquadringentillion ",
    " novenquinquagintaquadringentillion ",
    " sexagintaquadringentillion ",
    " unsexagintaquadringentillion ",
    " duosexagintaquadringentillion ",
    " tresexagintaquadringentillion ",
    " quattuorsexagintaquadringentillion ",
    " quinsexagintaquadringentillion ",
    " sesexagintaquadringentillion ",
    " septensexagintaquadringentillion ",
    " octosexagintaquadringentillion ",
    " novensexagintaquadringentillion ",
    " septuagintaquadringentillion ",
    " unseptuagintaquadringentillion ",
    " duoseptuagintaquadringentillion ",
    " treseptuagintaquadringentillion ",
    " quattuorseptuagintaquadringentillion ",
    " quinseptuagintaquadringentillion ",
    " seseptuagintaquadringentillion ",
    " septenseptuagintaquadringentillion ",
    " octoseptuagintaquadringentillion ",
    " novenseptuagintaquadringentillion ",
    " octogintaquadringentillion ",
    " unoctogintaquadringentillion ",
    " duooctogintaquadringentillion ",
    " tresoctogintaquadringentillion ",
    " quattuoroctogintaquadringentillion ",
    " quinoctogintaquadringentillion ",
    " sexoctogintaquadringentillion ",
    " septemoctogintaquadringentillion ",
    " octooctogintaquadringentillion ",
    " novemoctogintaquadringentillion ",
    " nonagintaquadringentillion ",
    " unnonagintaquadringentillion ",
    " duononagintaquadringentillion ",
    " trenonagintaquadringentillion ",
    " quattuornonagintaquadringentillion ",
    " quinnonagintaquadringentillion ",
    " senonagintaquadringentillion ",
    " septenonagintaquadringentillion ",
    " octononagintaquadringentillion ",
    " novenonagintaquadringentillion ",
    " quingentillion ",
    " unquingentillion ",
    " duoquingentillion ",
    " tresquingentillion ",
    " quattuorquingentillion ",
    " quinquingentillion ",
    " sesquingentillion ",
    " septenquingentillion ",
    " octoquingentillion ",
    " novenquingentillion ",
    " deciquingentillion ",
    " undeciquingentillion ",
    " duodeciquingentillion ",
    " tredeciquingentillion ",
    " quattuordeciquingentillion ",
    " quindeciquingentillion ",
    " sedeciquingentillion ",
    " septendeciquingentillion ",
    " octodeciquingentillion ",
    " novendeciquingentillion ",
    " vigintiquingentillion ",
    " unvigintiquingentillion ",
    " duovigintiquingentillion ",
    " tresvigintiquingentillion ",
    " quattuorvigintiquingentillion ",
    " quinvigintiquingentillion ",
    " sesvigintiquingentillion ",
    " septemvigintiquingentillion ",
    " octovigintiquingentillion ",
    " novemvigintiquingentillion ",
    " trigintaquingentillion ",
    " untrigintaquingentillion ",
    " duotrigintaquingentillion ",
    " trestrigintaquingentillion ",
    " quattuortrigintaquingentillion ",
    " quintrigintaquingentillion ",
    " sestrigintaquingentillion ",
    " septentrigintaquingentillion ",
    " octotrigintaquingentillion ",
    " noventrigintaquingentillion ",
    " quadragintaquingentillion ",
    " unquadragintaquingentillion ",
    " duoquadragintaquingentillion ",
    " tresquadragintaquingentillion ",
    " quattuorquadragintaquingentillion ",
    " quinquadragintaquingentillion ",
    " sesquadragintaquingentillion ",
    " septenquadragintaquingentillion ",
    " octoquadragintaquingentillion ",
    " novenquadragintaquingentillion ",
    " quinquagintaquingentillion ",
    " unquinquagintaquingentillion ",
    " duoquinquagintaquingentillion ",
    " tresquinquagintaquingentillion ",
    " quattuorquinquagintaquingentillion ",
    " quinquinquagintaquingentillion ",
    " sesquinquagintaquingentillion ",
    " septenquinquagintaquingentillion ",
    " octoquinquagintaquingentillion ",
    " novenquinquagintaquingentillion ",
    " sexagintaquingentillion ",
    " unsexagintaquingentillion ",
    " duosexagintaquingentillion ",
    " tresexagintaquingentillion ",
    " quattuorsexagintaquingentillion ",
    " quinsexagintaquingentillion ",
    " sesexagintaquingentillion ",
    " septensexagintaquingentillion ",
    " octosexagintaquingentillion ",
    " novensexagintaquingentillion ",
    " septuagintaquingentillion ",
    " unseptuagintaquingentillion ",
    " duoseptuagintaquingentillion ",
    " treseptuagintaquingentillion ",
    " quattuorseptuagintaquingentillion ",
    " quinseptuagintaquingentillion ",
    " seseptuagintaquingentillion ",
    " septenseptuagintaquingentillion ",
    " octoseptuagintaquingentillion ",
    " novenseptuagintaquingentillion ",
    " octogintaquingentillion ",
    " unoctogintaquingentillion ",
    " duooctogintaquingentillion ",
    " tresoctogintaquingentillion ",
    " quattuoroctogintaquingentillion ",
    " quinoctogintaquingentillion ",
    " sexoctogintaquingentillion ",
    " septemoctogintaquingentillion ",
    " octooctogintaquingentillion ",
    " novemoctogintaquingentillion ",
    " nonagintaquingentillion ",
    " unnonagintaquingentillion ",
    " duononagintaquingentillion ",
    " trenonagintaquingentillion ",
    " quattuornonagintaquingentillion ",
    " quinnonagintaquingentillion ",
    " senonagintaquingentillion ",
    " septenonagintaquingentillion ",
    " octononagintaquingentillion ",
    " novenonagintaquingentillion ",
    " sescentillion ",
    " unsescentillion ",
    " duosescentillion ",
    " tresescentillion ",
    " quattuorsescentillion ",
    " quinsescentillion ",
    " sesescentillion ",
    " septensescentillion ",
    " octosescentillion ",
    " novensescentillion ",
    " decisescentillion ",
    " undecisescentillion ",
    " duodecisescentillion ",
    " tredecisescentillion ",
    " quattuordecisescentillion ",
    " quindecisescentillion ",
    " sedecisescentillion ",
    " septendecisescentillion ",
    " octodecisescentillion ",
    " novendecisescentillion ",
    " vigintisescentillion ",
    " unvigintisescentillion ",
    " duovigintisescentillion ",
    " tresvigintisescentillion ",
    " quattuorvigintisescentillion ",
    " quinvigintisescentillion ",
    " sesvigintisescentillion ",
    " septemvigintisescentillion ",
    " octovigintisescentillion ",
    " novemvigintisescentillion ",
    " trigintasescentillion ",
    " untrigintasescentillion ",
    " duotrigintasescentillion ",
    " trestrigintasescentillion ",
    " quattuortrigintasescentillion ",
    " quintrigintasescentillion ",
    " sestrigintasescentillion ",
    " septentrigintasescentillion ",
    " octotrigintasescentillion ",
    " noventrigintasescentillion ",
    " quadragintasescentillion ",
    " unquadragintasescentillion ",
    " duoquadragintasescentillion ",
    " tresquadragintasescentillion ",
    " quattuorquadragintasescentillion ",
    " quinquadragintasescentillion ",
    " sesquadragintasescentillion ",
    " septenquadragintasescentillion ",
    " octoquadragintasescentillion ",
    " novenquadragintasescentillion ",
    " quinquagintasescentillion ",
    " unquinquagintasescentillion ",
    " duoquinquagintasescentillion ",
    " tresquinquagintasescentillion ",
    " quattuorquinquagintasescentillion ",
    " quinquinquagintasescentillion ",
    " sesquinquagintasescentillion ",
    " septenquinquagintasescentillion ",
    " octoquinquagintasescentillion ",
    " novenquinquagintasescentillion ",
    " sexagintasescentillion ",
    " unsexagintasescentillion ",
    " duosexagintasescentillion ",
    " tresexagintasescentillion ",
    " quattuorsexagintasescentillion ",
    " quinsexagintasescentillion ",
    " sesexagintasescentillion ",
    " septensexagintasescentillion ",
    " octosexagintasescentillion ",
    " novensexagintasescentillion ",
    " septuagintasescentillion ",
    " unseptuagintasescentillion ",
    " duoseptuagintasescentillion ",
    " treseptuagintasescentillion ",
    " quattuorseptuagintasescentillion ",
    " quinseptuagintasescentillion ",
    " seseptuagintasescentillion ",
    " septenseptuagintasescentillion ",
    " octoseptuagintasescentillion ",
    " novenseptuagintasescentillion ",
    " octogintasescentillion ",
    " unoctogintasescentillion ",
    " duooctogintasescentillion ",
    " tresoctogintasescentillion ",
    " quattuoroctogintasescentillion ",
    " quinoctogintasescentillion ",
    " sexoctogintasescentillion ",
    " septemoctogintasescentillion ",
    " octooctogintasescentillion ",
    " novemoctogintasescentillion ",
    " nonagintasescentillion ",
    " unnonagintasescentillion ",
    " duononagintasescentillion ",
    " trenonagintasescentillion ",
    " quattuornonagintasescentillion ",
    " quinnonagintasescentillion ",
    " senonagintasescentillion ",
    " septenonagintasescentillion ",
    " octononagintasescentillion ",
    " novenonagintasescentillion ",
    " septingentillion ",
    " unseptingentillion ",
    " duoseptingentillion ",
    " treseptingentillion ",
    " quattuorseptingentillion ",
    " quinseptingentillion ",
    " seseptingentillion ",
    " septenseptingentillion ",
    " octoseptingentillion ",
    " novenseptingentillion ",
    " deciseptingentillion ",
    " undeciseptingentillion ",
    " duodeciseptingentillion ",
    " tredeciseptingentillion ",
    " quattuordeciseptingentillion ",
    " quindeciseptingentillion ",
    " sedeciseptingentillion ",
    " septendeciseptingentillion ",
    " octodeciseptingentillion ",
    " novendeciseptingentillion ",
    " vigintiseptingentillion ",
    " unvigintiseptingentillion ",
    " duovigintiseptingentillion ",
    " tresvigintiseptingentillion ",
    " quattuorvigintiseptingentillion ",
    " quinvigintiseptingentillion ",
    " sesvigintiseptingentillion ",
    " septemvigintiseptingentillion ",
    " octovigintiseptingentillion ",
    " novemvigintiseptingentillion ",
    " trigintaseptingentillion ",
    " untrigintaseptingentillion ",
    " duotrigintaseptingentillion ",
    " trestrigintaseptingentillion ",
    " quattuortrigintaseptingentillion ",
    " quintrigintaseptingentillion ",
    " sestrigintaseptingentillion ",
    " septentrigintaseptingentillion ",
    " octotrigintaseptingentillion ",
    " noventrigintaseptingentillion ",
    " quadragintaseptingentillion ",
    " unquadragintaseptingentillion ",
    " duoquadragintaseptingentillion ",
    " tresquadragintaseptingentillion ",
    " quattuorquadragintaseptingentillion ",
    " quinquadragintaseptingentillion ",
    " sesquadragintaseptingentillion ",
    " septenquadragintaseptingentillion ",
    " octoquadragintaseptingentillion ",
    " novenquadragintaseptingentillion ",
    " quinquagintaseptingentillion ",
    " unquinquagintaseptingentillion ",
    " duoquinquagintaseptingentillion ",
    " tresquinquagintaseptingentillion ",
    " quattuorquinquagintaseptingentillion ",
    " quinquinquagintaseptingentillion ",
    " sesquinquagintaseptingentillion ",
    " septenquinquagintaseptingentillion ",
    " octoquinquagintaseptingentillion ",
    " novenquinquagintaseptingentillion ",
    " sexagintaseptingentillion ",
    " unsexagintaseptingentillion ",
    " duosexagintaseptingentillion ",
    " tresexagintaseptingentillion ",
    " quattuorsexagintaseptingentillion ",
    " quinsexagintaseptingentillion ",
    " sesexagintaseptingentillion ",
    " septensexagintaseptingentillion ",
    " octosexagintaseptingentillion ",
    " novensexagintaseptingentillion ",
    " septuagintaseptingentillion ",
    " unseptuagintaseptingentillion ",
    " duoseptuagintaseptingentillion ",
    " treseptuagintaseptingentillion ",
    " quattuorseptuagintaseptingentillion ",
    " quinseptuagintaseptingentillion ",
    " seseptuagintaseptingentillion ",
    " septenseptuagintaseptingentillion ",
    " octoseptuagintaseptingentillion ",
    " novenseptuagintaseptingentillion ",
    " octogintaseptingentillion ",
    " unoctogintaseptingentillion ",
    " duooctogintaseptingentillion ",
    " tresoctogintaseptingentillion ",
    " quattuoroctogintaseptingentillion ",
    " quinoctogintaseptingentillion ",
    " sexoctogintaseptingentillion ",
    " septemoctogintaseptingentillion ",
    " octooctogintaseptingentillion ",
    " novemoctogintaseptingentillion ",
    " nonagintaseptingentillion ",
    " unnonagintaseptingentillion ",
    " duononagintaseptingentillion ",
    " trenonagintaseptingentillion ",
    " quattuornonagintaseptingentillion ",
    " quinnonagintaseptingentillion ",
    " senonagintaseptingentillion ",
    " septenonagintaseptingentillion ",
    " octononagintaseptingentillion ",
    " novenonagintaseptingentillion ",
    " octingentillion ",
    " unoctingentillion ",
    " duooctingentillion ",
    " tresoctingentillion ",
    " quattuoroctingentillion ",
    " quinoctingentillion ",
    " sexoctingentillion ",
    " septemoctingentillion ",
    " octooctingentillion ",
    " novemoctingentillion ",
    " decioctingentillion ",
    " undecioctingentillion ",
    " duodecioctingentillion ",
    " tredecioctingentillion ",
    " quattuordecioctingentillion ",
    " quindecioctingentillion ",
    " sedecioctingentillion ",
    " septendecioctingentillion ",
    " octodecioctingentillion ",
    " novendecioctingentillion ",
    " vigintioctingentillion ",
    " unvigintioctingentillion ",
    " duovigintioctingentillion ",
    " tresvigintioctingentillion ",
    " quattuorvigintioctingentillion ",
    " quinvigintioctingentillion ",
    " sesvigintioctingentillion ",
    " septemvigintioctingentillion ",
    " octovigintioctingentillion ",
    " novemvigintioctingentillion ",
    " trigintaoctingentillion ",
    " untrigintaoctingentillion ",
    " duotrigintaoctingentillion ",
    " trestrigintaoctingentillion ",
    " quattuortrigintaoctingentillion ",
    " quintrigintaoctingentillion ",
    " sestrigintaoctingentillion ",
    " septentrigintaoctingentillion ",
    " octotrigintaoctingentillion ",
    " noventrigintaoctingentillion ",
    " quadragintaoctingentillion ",
    " unquadragintaoctingentillion ",
    " duoquadragintaoctingentillion ",
    " tresquadragintaoctingentillion ",
    " quattuorquadragintaoctingentillion ",
    " quinquadragintaoctingentillion ",
    " sesquadragintaoctingentillion ",
    " septenquadragintaoctingentillion ",
    " octoquadragintaoctingentillion ",
    " novenquadragintaoctingentillion ",
    " quinquagintaoctingentillion ",
    " unquinquagintaoctingentillion ",
    " duoquinquagintaoctingentillion ",
    " tresquinquagintaoctingentillion ",
    " quattuorquinquagintaoctingentillion ",
    " quinquinquagintaoctingentillion ",
    " sesquinquagintaoctingentillion ",
    " septenquinquagintaoctingentillion ",
    " octoquinquagintaoctingentillion ",
    " novenquinquagintaoctingentillion ",
    " sexagintaoctingentillion ",
    " unsexagintaoctingentillion ",
    " duosexagintaoctingentillion ",
    " tresexagintaoctingentillion ",
    " quattuorsexagintaoctingentillion ",
    " quinsexagintaoctingentillion ",
    " sesexagintaoctingentillion ",
    " septensexagintaoctingentillion ",
    " octosexagintaoctingentillion ",
    " novensexagintaoctingentillion ",
    " septuagintaoctingentillion ",
    " unseptuagintaoctingentillion ",
    " duoseptuagintaoctingentillion ",
    " treseptuagintaoctingentillion ",
    " quattuorseptuagintaoctingentillion ",
    " quinseptuagintaoctingentillion ",
    " seseptuagintaoctingentillion ",
    " septenseptuagintaoctingentillion ",
    " octoseptuagintaoctingentillion ",
    " novenseptuagintaoctingentillion ",
    " octogintaoctingentillion ",
    " unoctogintaoctingentillion ",
    " duooctogintaoctingentillion ",
    " tresoctogintaoctingentillion ",
    " quattuoroctogintaoctingentillion ",
    " quinoctogintaoctingentillion ",
    " sexoctogintaoctingentillion ",
    " septemoctogintaoctingentillion ",
    " octooctogintaoctingentillion ",
    " novemoctogintaoctingentillion ",
    " nonagintaoctingentillion ",
    " unnonagintaoctingentillion ",
    " duononagintaoctingentillion ",
    " trenonagintaoctingentillion ",
    " quattuornonagintaoctingentillion ",
    " quinnonagintaoctingentillion ",
    " senonagintaoctingentillion ",
    " septenonagintaoctingentillion ",
    " octononagintaoctingentillion ",
    " novenonagintaoctingentillion ",
    " nongentillion ",
    " unnongentillion ",
    " duonongentillion ",
    " trenongentillion ",
    " quattuornongentillion ",
    " quinnongentillion ",
    " senongentillion ",
    " septenongentillion ",
    " octonongentillion ",
    " novenongentillion ",
    " decinongentillion ",
    " undecinongentillion ",
    " duodecinongentillion ",
    " tredecinongentillion ",
    " quattuordecinongentillion ",
    " quindecinongentillion ",
    " sedecinongentillion ",
    " septendecinongentillion ",
    " octodecinongentillion ",
    " novendecinongentillion ",
    " vigintinongentillion ",
    " unvigintinongentillion ",
    " duovigintinongentillion ",
    " tresvigintinongentillion ",
    " quattuorvigintinongentillion ",
    " quinvigintinongentillion ",
    " sesvigintinongentillion ",
    " septemvigintinongentillion ",
    " octovigintinongentillion ",
    " novemvigintinongentillion ",
    " trigintanongentillion ",
    " untrigintanongentillion ",
    " duotrigintanongentillion ",
    " trestrigintanongentillion ",
    " quattuortrigintanongentillion ",
    " quintrigintanongentillion ",
    " sestrigintanongentillion ",
    " septentrigintanongentillion ",
    " octotrigintanongentillion ",
    " noventrigintanongentillion ",
    " quadragintanongentillion ",
    " unquadragintanongentillion ",
    " duoquadragintanongentillion ",
    " tresquadragintanongentillion ",
    " quattuorquadragintanongentillion ",
    " quinquadragintanongentillion ",
    " sesquadragintanongentillion ",
    " septenquadragintanongentillion ",
    " octoquadragintanongentillion ",
    " novenquadragintanongentillion ",
    " quinquagintanongentillion ",
    " unquinquagintanongentillion ",
    " duoquinquagintanongentillion ",
    " tresquinquagintanongentillion ",
    " quattuorquinquagintanongentillion ",
    " quinquinquagintanongentillion ",
    " sesquinquagintanongentillion ",
    " septenquinquagintanongentillion ",
    " octoquinquagintanongentillion ",
    " novenquinquagintanongentillion ",
    " sexagintanongentillion ",
    " unsexagintanongentillion ",
    " duosexagintanongentillion ",
    " tresexagintanongentillion ",
    " quattuorsexagintanongentillion ",
    " quinsexagintanongentillion ",
    " sesexagintanongentillion ",
    " septensexagintanongentillion ",
    " octosexagintanongentillion ",
    " novensexagintanongentillion ",
    " septuagintanongentillion ",
    " unseptuagintanongentillion ",
    " duoseptuagintanongentillion ",
    " treseptuagintanongentillion ",
    " quattuorseptuagintanongentillion ",
    " quinseptuagintanongentillion ",
    " seseptuagintanongentillion ",
    " septenseptuagintanongentillion ",
    " octoseptuagintanongentillion ",
    " novenseptuagintanongentillion ",
    " octogintanongentillion ",
    " unoctogintanongentillion ",
    " duooctogintanongentillion ",
    " tresoctogintanongentillion ",
    " quattuoroctogintanongentillion ",
    " quinoctogintanongentillion ",
    " sexoctogintanongentillion ",
    " septemoctogintanongentillion ",
    " octooctogintanongentillion ",
    " novemoctogintanongentillion ",
    " nonagintanongentillion ",
    " unnonagintanongentillion ",
    " duononagintanongentillion ",
    " trenonagintanongentillion ",
    " quattuornonagintanongentillion ",
    " quinnonagintanongentillion ",
    " senonagintanongentillion ",
    " septenonagintanongentillion ",
    " octononagintanongentillion ",
    " novenonagintanongentillion ",
    " millillion ",
    " millimillion "];