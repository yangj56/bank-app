import { SYSTEM_CONFIG } from '../config/system';
import { ValidationError } from '../error';

export function checkLeapYear(dateStr: string) {
  const year = +dateStr.slice(0, 4);
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function previousDay(date: Date) {
  const previousDay = new Date(date);
  previousDay.setDate(date.getDate() - 1);
  return previousDay;
}

export function nextDay(date: Date) {
  const nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);
  return nextDay;
}

/**
 * Formats a number with exactly two decimal places and returns it as a string
 * @param value The number to format
 * @returns A string representation of the number with exactly two decimal places
 */
export function displayDecimal(value: number): string {
  return value.toFixed(2);
}

export function formatDate(dateStr: string) {
  if (!/^\d{8}$/.test(dateStr)) {
    throw new ValidationError(`Date must be in the format ${SYSTEM_CONFIG.DATE_FORMAT} ${dateStr}`);
  }

  const year = +dateStr.slice(0, 4);
  const month = +dateStr.slice(4, 6);
  const day = +dateStr.slice(6, 8);

  const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));

  if (date.getUTCFullYear() !== year || date.getUTCMonth() + 1 !== month || date.getUTCDate() !== day) {
    throw new ValidationError(`Date is not valid, must be in the format ${SYSTEM_CONFIG.DATE_FORMAT} ${dateStr}`);
  }
  return date;
}

export function isDayInSameYearMonth(dateStrDay: string, dateStrMonth: string) {
  if (!/^\d{6}$/.test(dateStrMonth)) {
    throw new ValidationError(`Date must be in the format ${SYSTEM_CONFIG.DATE_MONTH_FORMAT} ${dateStrMonth}`);
  }
  if (!/^\d{8}$/.test(dateStrDay)) {
    throw new ValidationError(`Date must be in the format ${SYSTEM_CONFIG.DATE_FORMAT} ${dateStrDay}`);
  }
  const periodYear = +dateStrMonth.slice(0, 4);
  const periodMonth = +dateStrMonth.slice(4, 6);

  const checkYear = +dateStrDay.slice(0, 4);
  const checkMonth = +dateStrDay.slice(4, 6);

  return !!(periodYear === checkYear && periodMonth === checkMonth);
}

export function isFirstDayOfMonth(dateStr: string, period: string) {
  const day = +dateStr.slice(6, 8);
  return {
    isFirstDayOfMonth: day === 1,
    day: `${period.slice(0, 4)}${period.slice(4, 6)}01`,
  };
}

export function isLastDayOfMonth(dateStr: string, period: string) {
  const day = +dateStr.slice(6, 8);
  const periodYear = +period.slice(0, 4);
  const periodMonth = +period.slice(4, 6);
  const lastDayOfMonth = new Date(periodYear, periodMonth, 0).getDate();

  return {
    isLastDayOfMonth: day === lastDayOfMonth,
    day: `${period.slice(0, 4)}${period.slice(4, 6)}${lastDayOfMonth}`,
  };
}

export function dateDifference(startDate: Date, endDate: Date, mark?: string): number {
  console.log(`startDate ${mark}`, startDate);
  console.log(`endDate`, endDate);
  const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
}

export function getLastDayOfMonth(date: string) {
  const year = +date.slice(0, 4);
  const month = +date.slice(4, 6);
  const lastDayOfMonth = new Date(year, month, 0).getDate();
  return `${date.slice(0, 4)}${date.slice(4, 6)}${lastDayOfMonth}`;
}
