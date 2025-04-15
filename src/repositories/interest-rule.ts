import { InterestRule } from '../entities/interest-rule';
import { formatDate } from '../utils/date-utils';

export function addInterestRuleByOrder(map: Map<string, InterestRule>, newKey: string, newValue: InterestRule) {
  const entries = Array.from(map.entries());
  const insertIndex = entries.findIndex(([key]) => {
    const currentDate = formatDate(key);
    const newDate = formatDate(newKey);
    return newDate < currentDate;
  });
  const finalInsertIndex = insertIndex === -1 ? entries.length : insertIndex;
  const frontEntries = entries.slice(0, finalInsertIndex);
  const backEntries = entries.slice(finalInsertIndex);
  return new Map([...frontEntries, [newKey, newValue], ...backEntries]);
}

export function checkRuleIdExisted(map: Map<string, InterestRule>, ruleId: string) {
  for (let value of map.values()) {
    if (value.ruleId === ruleId) {
      return true;
    }
  }
  return false;
}
