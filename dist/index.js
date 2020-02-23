"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (cnp) {
    var result = {
        cnp: cnp,
        isValid: false,
        gender: null,
        year: null,
        month: null,
        day: null,
        date: null,
        countyIndex: null,
    };
    // General validation for input string
    var isNumeric = /^\d+$/.test(cnp);
    if (!isNumeric)
        return result;
    var validCnpLength = 13;
    if (cnp.length !== validCnpLength)
        return result;
    var cnpArray = Array.from(cnp).map(function (character) { return Number(character); });
    // Gender
    var genderIndicator = cnpArray[0];
    if (genderIndicator < 1 || genderIndicator > 8)
        return result;
    var gender = genderIndicator % 2 === 0 ? 'f' : 'm';
    // Year
    var year = 0;
    var year2ndPart = cnpArray[1] * 10 + cnpArray[2];
    switch (genderIndicator) {
        case 1:
        case 2:
            {
                year = 1900 + year2ndPart;
            }
            break;
        case 3:
        case 4:
            {
                year = 1800 + year2ndPart;
            }
            break;
        case 5:
        case 6:
            {
                year = 2000 + year2ndPart;
            }
            break;
        case 7:
        case 8:
        case 9:
            {
                year = 2000 + year2ndPart;
                if (year > (new Date().getFullYear() - 14)) {
                    year -= 100;
                }
            }
            break;
        default: return result;
    }
    if (year < 1800 || year > 2099)
        return result;
    // Validate date
    var month = cnpArray[3] * 10 + cnpArray[4];
    var day = cnpArray[5] * 10 + cnpArray[6];
    var dateObject = new Date(year, month - 1, day);
    var dateCheck = dateObject.getFullYear() + "/" + (dateObject.getMonth() + 1) + "/" + dateObject.getDate();
    var isValidDate = year + "/" + month + "/" + day === dateCheck;
    if (!isValidDate)
        return result;
    // County
    var countyIndex = cnpArray[7] * 10 + cnpArray[8];
    if (countyIndex < 1 || countyIndex > 52)
        return result;
    // Random 3 digits
    var randomNumber = cnpArray[9] * 100 + cnpArray[10] * 10 + cnpArray[11];
    if (randomNumber < 1)
        return result;
    // Check number
    var checkNumber = cnpArray[12];
    var checkArray = Array.from('279146358279').map(function (character) { return Number(character); });
    var checkSum = checkArray.reduce(function (acc, checkDigit, index) {
        var cnpDigit = cnpArray[index];
        return acc + cnpDigit * checkDigit;
    }, 0);
    var leftOver = checkSum % 11;
    var checkResult = leftOver === 10 ? 1 : leftOver;
    if (checkNumber !== checkResult)
        return result;
    result.isValid = true;
    result.gender = gender;
    result.year = year;
    result.month = month;
    result.day = day;
    result.date = dateObject;
    result.countyIndex = countyIndex;
    return result;
});
//# sourceMappingURL=index.js.map