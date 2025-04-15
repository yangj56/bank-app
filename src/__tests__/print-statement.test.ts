import { Bank } from '../entities/bank';
import { TransactionType } from '../entities/transaction';

describe.only('print statement', () => {
  const bank = new Bank('AwesomeGIC Bank');
  beforeEach(() => {
    bank.addTransaction('20210102', 'AC001', TransactionType.DEPOSIT, 1000);
    bank.addTransaction('20210102', 'AC001', TransactionType.WITHDRAWAL, 100);
    bank.addTransaction('20210103', 'AC001', TransactionType.DEPOSIT, 100);
    bank.addTransaction('20220104', 'AC001', TransactionType.WITHDRAWAL, 100);
    bank.addInterestRule('20221104', 'rule-1', 1.8);
    bank.addInterestRule('20220104', 'rule-2', 2.2);
  });
  it('should print the statement with interest calculated', () => {
    expect(bank.accounts[0].id).toBe(`AC001`);
    expect(bank.accounts[0].transactions.length).toBe(4);
    expect(bank.accounts[0].transactions[3].balance).toBe(900);
    const statement = bank.printStatement('AC001', '202201');
    expect(statement).toBe(`AwesomeGIC Bank\n1234\n20210102-01\n20210102-02\n20210103-01\n20220104-01\n`);
  });
});
