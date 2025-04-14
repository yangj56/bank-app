export enum TransactionType {
  DEPOSIT = 'D',
  WITHDRAWAL = 'W',
}

export class Transaction {
  date: string;
  amount: number;
  type: TransactionType;
  balance: number;

  constructor(
    date: string,
    amount: number,
    type: TransactionType,
    balance: number,
  ) {
    this.date = date;
    this.amount = amount;
    this.type = type;
    this.balance = balance;
  }
}
