import { getNextTransactionId } from '../utils/transaction-id-generator';

export enum TransactionType {
  DEPOSIT = 'D',
  WITHDRAWAL = 'W',
}

export class Transaction {
  id: string;
  date: string;
  amount: number;
  type: TransactionType;
  balance: number;
  previousBalance: number;
  createdAt: string;

  constructor(date: string, amount: number, type: TransactionType, balance: number, previousBalance: number) {
    this.id = getNextTransactionId(date);
    this.date = date;
    this.amount = amount;
    this.type = type;
    this.balance = balance;
    this.previousBalance = previousBalance;
    this.createdAt = new Date().toISOString();
  }
}
