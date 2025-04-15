import { SystemError } from '../error';
import { formatDate } from '../utils/date-utils';
import { Transaction, TransactionType } from './transaction';

export class Account {
  id: string;
  transactions: Transaction[];
  balance: number;

  constructor(id: string) {
    this.id = id;
    this.transactions = [];
    this.balance = 0;
  }

  public deposit(amount: number, date: string) {
    const lastTransaction = this.transactions[this.transactions.length - 1];
    if (lastTransaction) {
      const lastTransactionDate = formatDate(lastTransaction.date);
      const newTransactionDate = formatDate(date);
      if (newTransactionDate < lastTransactionDate) {
        throw new SystemError('Transactions must be sorted by date');
      }
    }

    const newBalance = this.balance + amount;
    this.transactions.push(new Transaction(date, amount, TransactionType.DEPOSIT, newBalance, this.balance));
    this.balance = newBalance;
  }

  public withdraw(amount: number, date: string) {
    const lastTransaction = this.transactions[this.transactions.length - 1];
    if (lastTransaction) {
      const lastTransactionDate = formatDate(lastTransaction.date);
      const newTransactionDate = formatDate(date);
      if (newTransactionDate < lastTransactionDate) {
        throw new SystemError('Transactions must be sorted by date');
      }
    }
    const newBalance = this.balance - amount;
    if (newBalance < 0) {
      throw new SystemError('Insufficient balance');
    }
    this.transactions.push(new Transaction(date, amount, TransactionType.WITHDRAWAL, newBalance, this.balance));
    this.balance = newBalance;
  }

  public displayTransactions() {
    console.log('Transactions:');
    this.transactions.forEach((transaction) => {
      console.log(transaction);
    });
  }
}
