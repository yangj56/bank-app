import { getLastDayOfMonth } from '../utils/date-utils';
import { Transaction } from '../entities/transaction';
import { isLastDayOfMonth } from '../utils/date-utils';
import { isFirstDayOfMonth } from '../utils/date-utils';
import { isDayInSameYearMonth } from '../utils/date-utils';

export type MonthBalanceCheckpoint = {
  date: string;
  balance: number;
};

export function generateMonthBalanceCheckpoint(transactions: Transaction[], period: string) {
  const monthBalanceCheckpoint: MonthBalanceCheckpoint[] = [];
  for (let i = 0; i < transactions.length; i++) {
    const currentTransaction = transactions[i];
    if (isDayInSameYearMonth(currentTransaction.date, period)) {
      if (i !== 0) {
        const previousTransaction = transactions[i - 1];
        if (previousTransaction && previousTransaction.date === currentTransaction.date) {
          monthBalanceCheckpoint.pop();
        }
      }
      if (i === 0) {
        const firstCollapseTransaction = transactions[0];
        const firstDay = isFirstDayOfMonth(firstCollapseTransaction.date, period);
        if (!firstDay.isFirstDayOfMonth) {
          monthBalanceCheckpoint.push({
            date: firstDay.day,
            balance: firstCollapseTransaction.previousBalance,
          });
        }
      }
      monthBalanceCheckpoint.push({
        date: currentTransaction.date,
        balance: currentTransaction.balance,
      });
      if (i === transactions.length - 1) {
        const lastCollapseTransaction = transactions[transactions.length - 1];
        const lastDay = isLastDayOfMonth(lastCollapseTransaction.date, period);
        if (!lastDay.isLastDayOfMonth) {
          monthBalanceCheckpoint.push({
            date: lastDay.day,
            balance: lastCollapseTransaction.balance,
          });
        }
      }
    } else {
      const periodFirstDay = `${period}01`;
      const periodLastDay = getLastDayOfMonth(period);
      monthBalanceCheckpoint.push({
        date: periodFirstDay,
        balance: currentTransaction.balance,
      });
      monthBalanceCheckpoint.push({
        date: periodLastDay,
        balance: currentTransaction.balance,
      });
    }
  }
  return monthBalanceCheckpoint;
}
