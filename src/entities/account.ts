import { Transaction, TransactionType } from './transaction';

export class Account {
  id: string;
  transactions: Transaction[];

  constructor(id: string) {
    this.id = id;
    this.transactions = [];
  }

  public deposit(amount: number, date: string) {
    const getLatestBalance = this.transactions[this.transactions.length - 1];
    this.transactions.push(
      new Transaction(
        date,
        amount,
        TransactionType.DEPOSIT,
        getLatestBalance.balance + amount,
      ),
    );
  }

  public withdraw(amount: number, date: string) {
    const getLatestBalance = this.transactions[this.transactions.length - 1];
    this.transactions.push(
      new Transaction(
        date,
        amount,
        TransactionType.WITHDRAWAL,
        getLatestBalance.balance - amount,
      ),
    );
  }

  public displayTransactions() {
    console.log('Transactions:');
    this.transactions.forEach((transaction) => {
      console.log(transaction);
    });
  }
}
