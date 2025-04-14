export class InterestRule {
  id: string;
  rate: number;
  date: string;

  constructor(date: string, ruleId: string, rate: number) {
    this.id = ruleId;
    this.rate = rate;
    this.date = date;
  }

  public calculateInterest(amount: number) {
    return amount * this.rate;
  }
}
