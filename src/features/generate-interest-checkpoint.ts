import { InterestRule } from '../entities/interest-rule';
import { formatDate } from '../utils/date-utils';

export type InterestCheckpoint = {
  date: string;
  rate: number;
  previousRate: number;
};

export function generateInterestCheckpoint(sortedInterestRules: InterestRule[], startDate: Date, endDate: Date) {
  const affectedInterestRules: InterestCheckpoint[] = [];
  for (let i = 0; i < sortedInterestRules.length; i++) {
    const rule = sortedInterestRules[i];
    const ruleDate = formatDate(rule.date);
    if (ruleDate > startDate && ruleDate < endDate) {
      let previousRate = 0;
      if (affectedInterestRules.length === 0) {
        const previousRule = sortedInterestRules[i - 1];
        if (previousRule) {
          previousRate = previousRule.rate;
        }
      }
      affectedInterestRules.push({
        date: rule.date,
        rate: rule.rate,
        previousRate: previousRate,
      });
    }
  }
  return affectedInterestRules;
}
