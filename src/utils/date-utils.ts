import { SYSTEM_CONFIG } from '../config/system';
import { ValidationError } from '../error';

export function formatDate(dateStr: string) {
  if (!/^\d{8}$/.test(dateStr)) {
    throw new ValidationError(`Date must be in the format ${SYSTEM_CONFIG.DATE_FORMAT} ${dateStr}`);
  }

  const year = +dateStr.slice(0, 4);
  const month = +dateStr.slice(4, 6);
  const day = +dateStr.slice(6, 8);

  const date = new Date(year, month - 1, day);
  console.log(dateStr);
  console.log(`date: ${date}`);

  if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
    throw new ValidationError(`Date is not valid, must be in the format ${SYSTEM_CONFIG.DATE_FORMAT} ${dateStr}`);
  }
  return date;
}

export function formatDateMonth(dateStr: string) {
  if (!/^\d{6}$/.test(dateStr)) {
    throw new ValidationError(`Date must be in the format ${SYSTEM_CONFIG.DATE_FORMAT} ${dateStr}`);
  }
  const year = +dateStr.slice(0, 4);
  const month = +dateStr.slice(4, 6);
  const day = +dateStr.slice(6, 8);

  const date = new Date(year, month - 1, day);
  console.log(dateStr);
  console.log(`date: ${date}`);

  if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
    throw new ValidationError(`Date is not valid, must be in the format ${SYSTEM_CONFIG.DATE_FORMAT} ${dateStr}`);
  }
  return date;
}
