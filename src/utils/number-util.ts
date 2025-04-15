export function round(number: number, precision: number) {
  return Math.round(number * Math.pow(10, precision)) / Math.pow(10, precision);
}

export function displayDecimal(number: number, precision: number) {
  return round(number, precision).toFixed(precision);
}
