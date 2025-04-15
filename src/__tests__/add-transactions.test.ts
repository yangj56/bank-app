import { Bank } from '../entities/bank';
import { TransactionType } from '../entities/transaction';

describe('adding transactions', () => {
  it('should add transactions to the bank with a new account', () => {
    const bank = new Bank('AwesomeGIC Bank');
    bank.addTransaction('20210101', '1234', TransactionType.DEPOSIT, 1000);
    bank.addTransaction('20210102', '1234', TransactionType.WITHDRAWAL, 100);
    bank.addTransaction('20210103', '1234', TransactionType.DEPOSIT, 100);
    bank.addTransaction('20210104', '1234', TransactionType.WITHDRAWAL, 100);
    expect(bank.accounts[0].id).toBe(`1234`);
    expect(bank.accounts[0].transactions.length).toBe(4);
    expect(bank.accounts[0].transactions[3].balance).toBe(900);
  });

  it('should reject if the first transaction is not a deposit', () => {
    const bank = new Bank('AwesomeGIC Bank');
    expect(() => bank.addTransaction('20210101', '1234', TransactionType.WITHDRAWAL, 1000)).toThrow(
      'First transaction must be a deposit',
    );
  });

  it('should reject if withdrawing more than the balance', () => {
    const bank = new Bank('AwesomeGIC Bank');
    bank.addTransaction('20210101', '1234', TransactionType.DEPOSIT, 1000);
    expect(() => bank.addTransaction('20210102', '1234', TransactionType.WITHDRAWAL, 1001)).toThrow(
      'Insufficient balance',
    );
  });

  it('should add transactions to the bank with multiple accounts', () => {
    const bank = new Bank('AwesomeGIC Bank');
    bank.addTransaction('20210101', '1234', TransactionType.DEPOSIT, 1000);
    bank.addTransaction('20210102', '1234', TransactionType.WITHDRAWAL, 100);
    bank.addTransaction('20210103', '1234', TransactionType.DEPOSIT, 300);
    bank.addTransaction('20210104', '1235', TransactionType.DEPOSIT, 100);
    expect(bank.accounts[0].id).toBe(`1234`);
    expect(bank.accounts[1].id).toBe(`1235`);
    expect(bank.accounts[0].transactions.length).toBe(3);
    expect(bank.accounts[1].transactions.length).toBe(1);
    expect(bank.accounts[0].transactions[2].balance).toBe(1200);
    expect(bank.accounts[1].transactions[0].balance).toBe(100);
  });

  it('should not allow transaction not inserted in date order', () => {
    const bank = new Bank('AwesomeGIC Bank');
    bank.addTransaction('20210101', '1234', TransactionType.DEPOSIT, 1000);
    bank.addTransaction('20210102', '1234', TransactionType.WITHDRAWAL, 100);
    bank.addTransaction('20210103', '1234', TransactionType.DEPOSIT, 300);
    expect(() => bank.addTransaction('20210101', '1234', TransactionType.DEPOSIT, 100)).toThrow(
      'Transactions must be sorted by date',
    );
  });

  it('should allow transaction and not affect order of other accounts transactions', () => {
    const bank = new Bank('AwesomeGIC Bank');
    bank.addTransaction('20210101', '1234', TransactionType.DEPOSIT, 1000);
    bank.addTransaction('20210102', '1234', TransactionType.WITHDRAWAL, 100);
    bank.addTransaction('20210103', '1234', TransactionType.DEPOSIT, 300);
    bank.addTransaction('20200104', '1235', TransactionType.DEPOSIT, 100);
    bank.addTransaction('20200105', '1235', TransactionType.DEPOSIT, 100);
  });
});
