export type CnpObject = {
  cnp: string,
  isValid: boolean,
  gender: 'm' | 'f' | null,
  year: number | null,
  month: number | null,
  day: number | null,
  date: Date | null,
  countyIndex: number | null,
}

export default (cnp: string): CnpObject => {
  const result: CnpObject = {
    cnp,
    isValid: false,
    gender: null,
    year: null,
    month: null,
    day: null,
    date: null,
    countyIndex: null,
  };

  // General validation for input string
  const isNumeric = /^\d+$/.test(cnp);
  if (!isNumeric) return result;

  const validCnpLength = 13;
  if (cnp.length !== validCnpLength) return result;

  const cnpArray: number[] = Array.from(cnp).map(character => Number(character));

  // Gender
  let genderIndicator = cnpArray[0];
  if (genderIndicator < 1 || genderIndicator > 8) return result;

  const gender = genderIndicator % 2 === 0 ? 'f' : 'm';

  // Year
  let year: number = 0;

  const year2ndPart = cnpArray[1] * 10 + cnpArray[2];
  switch (genderIndicator) {
    case 1  : case 2 : { year = 1900 + year2ndPart; } break;
    case 3  : case 4 : { year = 1800 + year2ndPart; } break;
    case 5  : case 6 : { year = 2000 + year2ndPart; } break;
    case 7  : case 8 : case 9 : {
      year = 2000 + year2ndPart;
      if( year > (new Date().getFullYear() - 14)) {
        year -= 100;
      }
    } break;
    default: return result;
  }

  if( year < 1800 || year > 2099 ) return result;

  // Validate date
  const month: number = cnpArray[3] * 10 + cnpArray[4];
  const day: number = cnpArray[5] * 10 + cnpArray[6];
  const dateObject = new Date(year, month - 1, day);
  const dateCheck = `${dateObject.getFullYear()}/${dateObject.getMonth() + 1}/${dateObject.getDate()}`;

  const isValidDate = `${year}/${month}/${day}` === dateCheck;
  if (!isValidDate) return result;

  // County
  const countyIndex: number = cnpArray[7] * 10 + cnpArray[8];
  if (countyIndex < 1 || countyIndex > 52) return result;

  // Random 3 digits
  const randomNumber: number = cnpArray[9] * 100 + cnpArray[10] * 10 + cnpArray[11];
  if (randomNumber < 1) return result;

  // Check number
  const checkNumber = cnpArray[12];
  const checkArray = Array.from('279146358279').map(character => Number(character));
  const checkSum: number = checkArray.reduce((acc, checkDigit, index) => {
    const cnpDigit = cnpArray[index];
    return acc + cnpDigit * checkDigit;
  }, 0);

  const leftOver = checkSum % 11;

  const checkResult = leftOver === 10 ? 1 : leftOver;

  if (checkNumber !== checkResult) return result;

  result.isValid = true;
  result.gender = gender;
  result.year = year;
  result.month = month;
  result.day = day;
  result.date = dateObject;
  result.countyIndex = countyIndex;
  return result;
}
