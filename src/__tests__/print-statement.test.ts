import { Bank } from '../entities/bank';
import { TransactionType } from '../entities/transaction';
import { dateDifference } from '../utils/date-utils';

describe.only('print statement', () => {
  const bank = new Bank('AwesomeGIC Bank');
  beforeEach(() => {
    bank.addTransaction('20230505', 'AC001', TransactionType.DEPOSIT, 100);
    bank.addTransaction('20230604', 'AC001', TransactionType.DEPOSIT, 150);
    bank.addTransaction('20230626', 'AC001', TransactionType.WITHDRAWAL, 20);
    bank.addTransaction('20230626', 'AC001', TransactionType.WITHDRAWAL, 100);
    bank.addInterestRule('20230520', 'RULE02', 1.9);
    bank.addInterestRule('20230615', 'RULE03', 2.2);
    bank.addInterestRule('20230613', 'RULE04', 1.3);
    bank.addInterestRule('20230101', 'RULE01', 1.95);
  });
  it('should check date difference', () => {
    const startDate = new Date('2023-06-01');
    const endDate = new Date('2023-06-02');
    const daysDiff = dateDifference(startDate, endDate);
    expect(daysDiff).toBe(2);
    const startDate2 = new Date('2023-06-26');
    const endDate2 = new Date('2023-06-30');
    const daysDiff2 = dateDifference(startDate2, endDate2);
    expect(daysDiff2).toBe(5);
  });
  it.only('should print the statement with interest calculated', () => {
    expect(bank.accounts[0].id).toBe(`AC001`);
    // expect(bank.accounts[0].transactions.length).toBe(4);
    // expect(bank.interestRules.size).toBe(3);
    const result = bank.printStatement('AC001', '202306');
    console.log(result);
  });
});
