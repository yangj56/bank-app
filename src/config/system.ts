export const SYSTEM_CONFIG = {
  DATE_FORMAT: 'YYYYMMDD',
  INTEREST_RULE_ID_LENGTH: 4,
  INTEREST_RULE_ID_PREFIX: 'TAX',
  SYSTEM_NAME: 'Banking App',
  ACCOUNT_ID_LENGTH: 4,
} as const;

export const SYSTEM_ERRORS = {
  INVALID_DATE: 'Invalid date',
  INVALID_DATE_FORMAT: `Date must be in format ${SYSTEM_CONFIG.DATE_FORMAT}`,
  INVALID_INPUT: 'Invalid input',
} as const;
