import {
  addInterestRuleInputValidator,
  addTransactionInputValidator,
  optionInputValidator,
  printStatementInputValidator,
} from '../options/prompt-input-validator';
import { dateDifference } from '../utils/date-utils';

describe('validator', () => {
  it('should validate date difference', () => {
    const startDate = new Date('2023-06-01');
    const endDate = new Date('2023-06-02');
    const daysDiff = dateDifference(startDate, endDate);
    expect(daysDiff).toBe(2);
    const startDate2 = new Date('2023-06-26');
    const endDate2 = new Date('2023-06-30');
    const daysDiff2 = dateDifference(startDate2, endDate2);
    expect(daysDiff2).toBe(5);
  });
  it('should validate input for print statement', () => {
    const isValid = printStatementInputValidator(`AC001 202306`);
    expect(isValid.isError).toBe(false);
  });
  it('should invalidate input for print statement', () => {
    const isValid = printStatementInputValidator(`AC001 20230601`);
    expect(isValid.isError).toBe(true);
  });
  it('should validate input for add transaction', () => {
    const isValid = addTransactionInputValidator(`20230601 AC001 D 100`);
    expect(isValid.isError).toBe(false);
  });
  it('should invalidate input for add transaction', () => {
    const isValid = addTransactionInputValidator(`20231601 AC001 W 100`);
    expect(isValid.isError).toBe(true);
  });
  it('should validate input for add interest rule', () => {
    const isValid = addInterestRuleInputValidator(`20230601 RULE001 10`);
    expect(isValid.isError).toBe(false);
  });
  it('should invalidate input for add interest rule', () => {
    const isValid = addInterestRuleInputValidator(`20231601 RULE001 10`);
    expect(isValid.isError).toBe(true);
  });
  it('should validate TIPQ options', () => {
    const isValid = optionInputValidator(`T`);
    expect(isValid.isError).toBe(false);
    const isValid2 = optionInputValidator(`I`);
    expect(isValid2.isError).toBe(false);
    const isValid3 = optionInputValidator(`P`);
    expect(isValid3.isError).toBe(false);
    const isValid4 = optionInputValidator(`Q`);
    expect(isValid4.isError).toBe(false);
    const isValid5 = optionInputValidator(`X`);
    expect(isValid5.isError).toBe(true);
  });
});
