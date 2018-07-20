/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
var invalidInputs = [
    "$1.00",
    "1/2",
    "1E2",
    "1E02",
    "1E+02",
    "-$1.00",
    "-1/2",
    "-1E2",
    "-1E02",
    "-1E+02",
    "1/0",
    "0/0",
    "-2147483648/-1",
    "-9223372036854775808/-1",
    "-0",
    "-0.0",
    "+0",
    "+0.0",
    "0..0",
    ".",
    "0.0.0",
    "0,00",
    "0,,0",
    ",",
    "0,0,0",
    "0.0/0",
    "1.0/0.0",
    "0.0/0.0",
    "1,0/0,0",
    "0,0/0,0",
    "--1",
    "-",
    "-.",
    "-,",
    "NaN",
    "Infinity",
    "-Infinity",
    "INF",
    "1#INF",
    "-1#IND",
    "1#QNAN",
    "1#SNAN",
    "1#IND",
    "0x0",
    "0xffffffff",
    "0xffffffffffffffff",
    "0xabad1dea",
    "1,000.00",
    "1 000.00",
    "1'000.00",
    "1,000,000.00",
    "1 000 000.00",
    "1'000'000.00",
    "1.000,00",
    "1 000,00",
    "1'000,00",
    "1.000.000,00",
    "1 000 000,00",
    "1'000'000,00",
    "2.2250738585072011e-308",
    "test",
    "\"\"",
    "/"];
var validInputs = [
    "999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999",
    "-5",
    "-5.",
    "500",
    "123456789012345678901234567890123456789",
    "01000",
    "08",
    "09",
    "0",
    "1",
    "1.00"
];
var zeroValues = [
    "000000",
    "0.",
    "0"
];

describe('isValid', function () {
    it('returns false on invalid inputs', function () {
        invalidInputs.forEach(function (invalidString) {
            let stringIsValid = isValid(invalidString);
            //console.log(invalidString);
            if (stringIsValid) {
                console.log(invalidString + " should return false, but returns true.");
            }
            expect(stringIsValid).toBe(false);
        });
    });
    it('returns true on valid inputs', function () {
        validInputs.forEach(function (validString) {
            let stringIsValid = isValid(validString);
            if (!stringIsValid) {
                console.log(validString + " should return true, but returns false.");
            }
            expect(stringIsValid).toBe(true);
        });
    });
});