import { getAccount } from './account';
import { Transaction } from '../entities/transaction';
import { Bank } from '../entities/bank';
import { dateGetPeriod, formatDate, isDayInSameYearMonth } from '../utils/date-utils';
import { Account } from '../entities/account';

export function getTransactionCounter(date: string, accountId: string, bank: Bank, account: Account | undefined) {
  const period = dateGetPeriod(date);
  if (!account) {
    return 0;
  }
  const transactions = getTransactionsInPeriod(accountId, bank, period);
  const transactionCount = transactions?.length || 0;
  return transactionCount;
}

export function getTransactionsInPeriod(accountId: string, bank: Bank, period: string) {
  const account = getAccount(accountId, bank);
  const transactions = account.transactions.filter((transaction: Transaction) => {
    if (isDayInSameYearMonth(transaction.date, period)) {
      return transaction;
    }
  });
  return transactions;
}

export function getCalculatedTransactions(account: Account, period: string, transactions: Transaction[]) {
  let calculatedTransactions = [...transactions];
  if (calculatedTransactions.length === 0) {
    for (let i = 0; i < account.transactions.length; i++) {
      const transaction = account.transactions[i];
      const transactionDate = formatDate(transaction.date);
      const startDate = formatDate(`${period}01`);
      if (startDate > transactionDate && i > 0 && calculatedTransactions.length === 0) {
        const previousTransaction = account.transactions[i - 1];
        if (previousTransaction) {
          calculatedTransactions.push(previousTransaction);
        }
      }
    }
  }
  return calculatedTransactions;
}
