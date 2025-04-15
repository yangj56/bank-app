import { Bank } from '../entities/bank';

describe('add interest rules', () => {
  it('should add an interest rule to the bank', () => {
    const bank = new Bank('AwesomeGIC Bank');
    bank.addInterestRule('20210101', '1234', 10);
    expect(bank.interestRules.size).toBe(1);
    expect(bank.interestRules.get('20210101')?.date).toBe('20210101');
    expect(bank.interestRules.get('20210101')?.ruleId).toBe('1234');
    expect(bank.interestRules.get('20210101')?.rate).toBe(10);
  });

  it('should add an interest rule to the bank with multiple rules', () => {
    const bank = new Bank('AwesomeGIC Bank');
    bank.addInterestRule('20210101', '1234', 10);
    bank.addInterestRule('20210102', '1235', 11);
    expect(bank.interestRules.size).toBe(2);
    expect(bank.interestRules.get('20210101')?.date).toBe('20210101');
    expect(bank.interestRules.get('20210101')?.ruleId).toBe('1234');
    expect(bank.interestRules.get('20210101')?.rate).toBe(10);
    expect(bank.interestRules.get('20210102')?.date).toBe('20210102');
    expect(bank.interestRules.get('20210102')?.ruleId).toBe('1235');
  });

  it('should overwrite the existing rule if the date is the same', () => {
    const bank = new Bank('AwesomeGIC Bank');
    bank.addInterestRule('20210101', '1233', 15);
    bank.addInterestRule('20210101', '1234', 10);
    bank.addInterestRule('20210101', '1235', 11);
    expect(bank.interestRules.size).toBe(1);
    expect(bank.interestRules.get('20210101')?.ruleId).toBe('1235');
    expect(bank.interestRules.get('20210101')?.rate).toBe(11);
  });

  it('should not allow duplicate rule id', () => {
    const bank = new Bank('AwesomeGIC Bank');
    bank.addInterestRule('20210101', '1234', 10);
    expect(() => bank.addInterestRule('20210101', '1234', 11)).toThrow('Rule ID already exists');
  });

  it('should be sorted by date and 1 overwrite', () => {
    const bank = new Bank('AwesomeGIC Bank');
    bank.addInterestRule('20210102', '1111', 11);
    bank.addInterestRule('20251101', '1112', 10);
    bank.addInterestRule('20250201', '1113', 10);
    bank.addInterestRule('20240101', '1114', 10);
    bank.addInterestRule('20230102', '1115', 4);
    bank.addInterestRule('20010102', '1116', 4);
    bank.addInterestRule('20240101', '1117', 4);
    bank.addInterestRule('20150122', '1118', 4);

    expect(bank.interestRules.size).toBe(7);
    const latestInterestRule = Array.from(bank.interestRules.values())[bank.interestRules.size - 1];
    expect(latestInterestRule?.date).toBe('20251101');
    const firstInterestRule = Array.from(bank.interestRules.values())[0];
    expect(firstInterestRule?.date).toBe('20010102');
  });
});
