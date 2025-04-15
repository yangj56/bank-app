import { Bank } from '../entities/bank';
import { TransactionType } from '../entities/transaction';

describe('calculate interest', () => {
  let bank: Bank;
  beforeEach(() => {
    bank = new Bank('AwesomeGIC Bank');
  });

  it('should pass the given example in the document', () => {
    bank.addTransaction('20230505', 'AC001', TransactionType.DEPOSIT, 100);
    bank.addTransaction('20230601', 'AC001', TransactionType.DEPOSIT, 150);
    bank.addTransaction('20230626', 'AC001', TransactionType.WITHDRAWAL, 20);
    bank.addTransaction('20230626', 'AC001', TransactionType.WITHDRAWAL, 100);
    bank.addInterestRule('20230101', 'RULE01', 1.95);
    bank.addInterestRule('20230520', 'RULE02', 1.9);
    bank.addInterestRule('20230615', 'RULE03', 2.2);
    const result = bank.calculatePeriodInterest('AC001', '202306');
    expect(result.interestRate).toBe(0.39);
    expect(result.transactions.length).toBe(3);
    expect(result.amountWithInterest).toBe(130.39);
  });

  it('should use default interest rate if no interest rule is found', () => {
    bank.addTransaction('20230505', 'AC001', TransactionType.DEPOSIT, 100);
    bank.addTransaction('20230601', 'AC001', TransactionType.DEPOSIT, 150);
    bank.addTransaction('20230626', 'AC001', TransactionType.WITHDRAWAL, 20);
    bank.addTransaction('20230626', 'AC001', TransactionType.WITHDRAWAL, 100);
    const result = bank.calculatePeriodInterest('AC001', '202306');
    expect(result.interestRate).toBe(0.2);
    expect(result.transactions.length).toBe(3);
    expect(result.amountWithInterest).toBe(130.2);
  });

  it('should use default interest rate if interest rule is applied after the period', () => {
    bank.addTransaction('20230505', 'AC001', TransactionType.DEPOSIT, 100);
    bank.addTransaction('20230601', 'AC001', TransactionType.DEPOSIT, 150);
    bank.addTransaction('20230626', 'AC001', TransactionType.WITHDRAWAL, 20);
    bank.addTransaction('20230626', 'AC001', TransactionType.WITHDRAWAL, 100);
    bank.addInterestRule('20230701', 'RULE01', 1.95);
    const result = bank.calculatePeriodInterest('AC001', '202306');
    expect(result.interestRate).toBe(0.2);
    expect(result.transactions.length).toBe(3);
    expect(result.amountWithInterest).toBe(130.2);
  });

  it('should calculate interest rate for the period when transaction is on the 3rd day of the month', () => {
    bank.addTransaction('20230505', 'AC001', TransactionType.DEPOSIT, 100);
    bank.addTransaction('20230603', 'AC001', TransactionType.DEPOSIT, 150);
    bank.addTransaction('20230626', 'AC001', TransactionType.WITHDRAWAL, 20);
    bank.addTransaction('20230626', 'AC001', TransactionType.WITHDRAWAL, 100);
    bank.addInterestRule('20230101', 'RULE01', 1.95);
    bank.addInterestRule('20230520', 'RULE02', 1.9);
    bank.addInterestRule('20230615', 'RULE03', 2.2);
    const result = bank.calculatePeriodInterest('AC001', '202306');
    expect(result.interestRate).toBe(0.38);
    expect(result.transactions.length).toBe(3);
    expect(result.amountWithInterest).toBe(130.38);
  });

  it('should calculate base on previous months balance if check period has no transactions', () => {
    bank.addTransaction('20230505', 'AC001', TransactionType.DEPOSIT, 100);
    bank.addTransaction('20230603', 'AC001', TransactionType.DEPOSIT, 150);
    bank.addTransaction('20230626', 'AC001', TransactionType.WITHDRAWAL, 20);
    bank.addTransaction('20230626', 'AC001', TransactionType.WITHDRAWAL, 100);
    bank.addInterestRule('20230101', 'RULE01', 1.95);
    bank.addInterestRule('20230520', 'RULE02', 1.9);
    bank.addInterestRule('20230615', 'RULE03', 2.2);
    const result = bank.calculatePeriodInterest('AC001', '202309');
    expect(result.interestRate).toBe(0.18);
    expect(result.transactions.length).toBe(0);
    expect(result.amountWithInterest).toBe(100.18);
  });

  it('should return 0 if no transaction before period', () => {
    bank.addTransaction('20230505', 'AC001', TransactionType.DEPOSIT, 100);
    bank.addTransaction('20230603', 'AC001', TransactionType.DEPOSIT, 150);
    bank.addTransaction('20230626', 'AC001', TransactionType.WITHDRAWAL, 20);
    bank.addTransaction('20230626', 'AC001', TransactionType.WITHDRAWAL, 100);
    bank.addInterestRule('20180101', 'RULE00', 3.95);
    bank.addInterestRule('20230101', 'RULE01', 1.95);
    bank.addInterestRule('20230520', 'RULE02', 1.9);
    bank.addInterestRule('20230615', 'RULE03', 2.2);
    const result = bank.calculatePeriodInterest('AC001', '201901');
    expect(result.interestRate).toBe(0);
    expect(result.transactions.length).toBe(0);
    expect(result.amountWithInterest).toBe(0);
  });

  it('should calculate interest if interest rule is set before period', () => {
    bank.addTransaction('20230305', 'AC001', TransactionType.DEPOSIT, 100);
    bank.addTransaction('20230306', 'AC001', TransactionType.WITHDRAWAL, 50);
    bank.addTransaction('20230505', 'AC001', TransactionType.DEPOSIT, 100);
    bank.addTransaction('20230603', 'AC001', TransactionType.DEPOSIT, 150);
    bank.addTransaction('20230626', 'AC001', TransactionType.WITHDRAWAL, 20);
    bank.addTransaction('20230626', 'AC001', TransactionType.WITHDRAWAL, 100);
    bank.addInterestRule('20180101', 'RULE00', 3.95);
    const result = bank.calculatePeriodInterest('AC001', '202305');
    expect(result.interestRate).toBe(0.47);
    expect(result.transactions.length).toBe(1);
    expect(result.amountWithInterest).toBe(150.47);
  });

  it('should calculate interest rate for leap year using 366 days', () => {
    bank.addTransaction('20240305', 'AC001', TransactionType.DEPOSIT, 100);
    bank.addTransaction('20240306', 'AC001', TransactionType.WITHDRAWAL, 50);
    bank.addTransaction('20240505', 'AC001', TransactionType.DEPOSIT, 100);
    bank.addTransaction('20240603', 'AC001', TransactionType.DEPOSIT, 150);
    bank.addTransaction('20240626', 'AC001', TransactionType.WITHDRAWAL, 20);
    bank.addTransaction('20240626', 'AC001', TransactionType.WITHDRAWAL, 100);
    bank.addInterestRule('20180101', 'RULE00', 3.95);
    const result = bank.calculatePeriodInterest('AC001', '202405');
    expect(result.interestRate).toBe(0.46);
    expect(result.transactions.length).toBe(1);
    expect(result.amountWithInterest).toBe(150.46);
  });
});
