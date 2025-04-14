import { SYSTEM_CONFIG } from '../config/system';

/**
 * Generates a unique booking ID
 * @returns The generated auto increment booking ID
 */
let interestRuleId = 0;
export function getNextInterestRuleId(): string {
  interestRuleId++;
  return `${SYSTEM_CONFIG.INTEREST_RULE_ID_PREFIX}${interestRuleId.toString().padStart(SYSTEM_CONFIG.INTEREST_RULE_ID_LENGTH, '0')}`;
}
