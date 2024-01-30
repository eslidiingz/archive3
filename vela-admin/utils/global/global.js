export const numberComma = (number) => {
  try {
    number = number.toString().replace(/,/g, "");
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } catch {
    return number;
  }
};

export const numberFormat = (number) => {
  try {
    if (number == "") {
      number = 0;
    }
    number = parseFloat(number);
    return numberComma(number.toFixed(2));
  } catch {
    return number;
  }
};
