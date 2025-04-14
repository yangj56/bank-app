import { Transaction, TransactionType } from './transaction';

export class Account {
  id: string;
  accountType: string;
  transactions: Transaction[];

  constructor(id: string, accountType: string) {
    this.id = id;
    this.accountType = accountType;
    this.transactions = [];
  }

  public deposit(amount: number) {
    const getLatestBalance = this.transactions[this.transactions.length - 1];
    this.transactions.push(
      new Transaction(
        new Date().toISOString(),
        amount,
        TransactionType.DEPOSIT,
        getLatestBalance.balance + amount,
      ),
    );
  }

  public withdraw(amount: number) {
    const getLatestBalance = this.transactions[this.transactions.length - 1];
    this.transactions.push(
      new Transaction(
        new Date().toISOString(),
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
