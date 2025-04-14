import { getNextInterestRuleId } from '../utils/interest-rule-id-generator';

export class InterestRule {
  id: string;
  rate: number;
  name: string;
  date: string;

  constructor(rate: number, name: string, date: string) {
    this.id = getNextInterestRuleId();
    this.rate = rate;
    this.name = name;
    this.date = date;
  }

  public calculateInterest(amount: number) {
    return amount * this.rate;
  }
}
