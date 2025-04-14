export const SYSTEM_CONFIG = {
  DATE_FORMAT: 'YYYYMMdd',
  INTEREST_RULE_ID_LENGTH: 4,
  INTEREST_RULE_ID_PREFIX: 'TAX',
  SYSTEM_NAME: 'AwesomeGIC Bank',
  ACCOUNT_ID_LENGTH: 4,
  TRANSACTION_ID_LENGTH: 4,
  GO_BACK_STATEMENT: '(or enter blank to go back to main menu):',
} as const;

export const SYSTEM_ERRORS = {
  INVALID_DATE: 'Invalid date',
  INVALID_DATE_FORMAT: `Date must be in format ${SYSTEM_CONFIG.DATE_FORMAT}`,
  INVALID_INPUT: 'Invalid input',
} as const;
