import { SYSTEM_ERRORS } from '../config/system';
import { TransactionType } from '../entities/transaction';
import { ValidationError } from '../error';
import { formatDate } from '../utils/date-utils';

export type ValidatorResult<T> = {
  isError: boolean;
  errorMessage: string;
  checkedInput: T;
};

export function optionInputValidator(input: string): ValidatorResult<'T' | 'I' | 'P' | 'Q' | undefined> {
  if (input === '') {
    return { isError: false, errorMessage: '', checkedInput: undefined };
  }
  if (input === 'T' || input === 'I' || input === 'P' || input === 'Q') {
    return { isError: false, errorMessage: '', checkedInput: input };
  }
  return {
    isError: true,
    errorMessage: SYSTEM_ERRORS.INVALID_INPUT,
    checkedInput: undefined,
  };
}

export function addTransactionInputValidator(
  input: string,
): ValidatorResult<[string, string, TransactionType, number] | undefined> {
  const parts = input.trim().split(' ');
  if (parts.length === 4) {
    const date = parts[0];
    const accountId = parts[1];
    const transactionType = parts[2];
    const amount = parts[3];

    const dateValidator = dateInputValidator(date);
    if (dateValidator.isError) {
      return {
        isError: true,
        errorMessage: dateValidator.errorMessage,
        checkedInput: undefined,
      };
    }
    const accountIdValidator = accountIdInputValidator(accountId);
    if (accountIdValidator.isError) {
      return {
        isError: true,
        errorMessage: accountIdValidator.errorMessage,
        checkedInput: undefined,
      };
    }
    const transactionTypeValidator = transactionTypeInputValidator(transactionType);
    if (transactionTypeValidator.isError) {
      return {
        isError: true,
        errorMessage: transactionTypeValidator.errorMessage,
        checkedInput: undefined,
      };
    }
    const amountValidator = amountInputValidator(amount);
    if (amountValidator.isError) {
      return {
        isError: true,
        errorMessage: amountValidator.errorMessage,
        checkedInput: undefined,
      };
    }
    return {
      isError: false,
      errorMessage: '',
      checkedInput: [
        dateValidator.checkedInput,
        accountIdValidator.checkedInput,
        transactionTypeValidator.checkedInput,
        amountValidator.checkedInput,
      ],
    };
  }
  return {
    isError: true,
    errorMessage: SYSTEM_ERRORS.INVALID_INPUT,
    checkedInput: undefined,
  };
}

export function addInterestRuleInputValidator(input: string): ValidatorResult<[string, string, number] | undefined> {
  const parts = input.trim().split(' ');
  if (parts.length === 3) {
    const date = parts[0];
    const ruleId = parts[1];
    const rate = parts[2];

    const dateValidator = dateInputValidator(date);
    if (dateValidator.isError) {
      return {
        isError: true,
        errorMessage: dateValidator.errorMessage,
        checkedInput: undefined,
      };
    }

    const ruleIdValidator = stringInputValidator(ruleId);
    if (ruleIdValidator.isError) {
      return {
        isError: true,
        errorMessage: ruleIdValidator.errorMessage,
        checkedInput: undefined,
      };
    }

    const rateValidator = amountInputValidator(rate);
    if (rateValidator.isError) {
      return {
        isError: true,
        errorMessage: rateValidator.errorMessage,
        checkedInput: undefined,
      };
    }
    return {
      isError: false,
      errorMessage: '',
      checkedInput: [dateValidator.checkedInput, ruleIdValidator.checkedInput, rateValidator.checkedInput],
    };
  }
  return {
    isError: true,
    errorMessage: SYSTEM_ERRORS.INVALID_INPUT,
    checkedInput: undefined,
  };
}

export function printStatementInputValidator(input: string): ValidatorResult<[string, string] | undefined> {
  const parts = input.trim().split(' ');
  if (parts.length === 2) {
    const account = parts[0];
    const yearMonth = parts[1];

    const accountValidator = accountIdInputValidator(account);
    if (accountValidator.isError) {
      return {
        isError: true,
        errorMessage: accountValidator.errorMessage,
        checkedInput: undefined,
      };
    }
    const yearMonthValidator = yearMonthInputValidator(yearMonth);
    if (yearMonthValidator.isError) {
      return {
        isError: true,
        errorMessage: yearMonthValidator.errorMessage,
        checkedInput: undefined,
      };
    }
    return {
      isError: false,
      errorMessage: '',
      checkedInput: [accountValidator.checkedInput, yearMonthValidator.checkedInput],
    };
  }
  return {
    isError: true,
    errorMessage: SYSTEM_ERRORS.INVALID_INPUT,
    checkedInput: undefined,
  };
}

export function dateInputValidator(input: string): ValidatorResult<string> {
  try {
    formatDate(input);
    return {
      isError: false,
      errorMessage: '',
      checkedInput: input,
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      return {
        isError: true,
        errorMessage: error.message,
        checkedInput: '',
      };
    }
    return {
      isError: true,
      errorMessage: `Invalid date: ${input}`,
      checkedInput: '',
    };
  }
}

export function stringInputValidator(input: string): ValidatorResult<string> {
  if (input.length === 0) {
    return {
      isError: true,
      errorMessage: SYSTEM_ERRORS.INVALID_INPUT,
      checkedInput: '',
    };
  }
  return {
    isError: false,
    errorMessage: '',
    checkedInput: input,
  };
}

function accountIdInputValidator(input: string): ValidatorResult<string> {
  if (typeof input !== 'string') {
    return {
      isError: true,
      errorMessage: `Invalid account id: ${input}`,
      checkedInput: '',
    };
  }
  return {
    isError: false,
    errorMessage: '',
    checkedInput: input,
  };
}

function transactionTypeInputValidator(input: string): ValidatorResult<TransactionType> {
  if (input !== TransactionType.DEPOSIT && input !== TransactionType.WITHDRAWAL) {
    return {
      isError: true,
      errorMessage: `Invalid transaction type: ${input}`,
      checkedInput: TransactionType.DEPOSIT,
    };
  }
  return {
    isError: false,
    errorMessage: '',
    checkedInput: input,
  };
}

function amountInputValidator(input: string): ValidatorResult<number> {
  const amount = parseFloat(input);
  if (isNaN(amount)) {
    return {
      isError: true,
      errorMessage: `Invalid amount: ${input}`,
      checkedInput: 0,
    };
  }
  return {
    isError: false,
    errorMessage: '',
    checkedInput: amount,
  };
}

export function rateInputValidator(input: string): ValidatorResult<number> {
  const rate = parseFloat(input);
  if (isNaN(rate)) {
    return {
      isError: true,
      errorMessage: `Invalid rate: ${input}`,
      checkedInput: 0,
    };
  }
  if (rate < 0 || rate > 100) {
    return {
      isError: true,
      errorMessage: `Invalid rate: ${input}`,
      checkedInput: 0,
    };
  }

  return {
    isError: false,
    errorMessage: '',
    checkedInput: rate,
  };
}

function yearMonthInputValidator(input: string): ValidatorResult<string> {
  try {
    const yearMonth = input.trim();
    if (yearMonth.length !== 6) {
      return {
        isError: true,
        errorMessage: `Invalid year month: ${input}`,
        checkedInput: '',
      };
    }
    formatDate(`${yearMonth}01`);
    return {
      isError: false,
      errorMessage: '',
      checkedInput: input,
    };
  } catch (error) {
    if (error instanceof ValidationError) {
      return {
        isError: true,
        errorMessage: error.message,
        checkedInput: '',
      };
    }
    return {
      isError: true,
      errorMessage: `Invalid year month: ${input}`,
      checkedInput: '',
    };
  }
}
