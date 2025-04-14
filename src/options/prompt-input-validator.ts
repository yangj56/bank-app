import { SYSTEM_CONFIG, SYSTEM_ERRORS } from '../config/system';
import { TransactionType } from '../entities/transaction';

export type ValidatorResult<T> = {
  isError: boolean;
  errorMessage: string;
  checkedInput: T;
};

export function optionInputValidator(
  input: string,
): ValidatorResult<'T' | 'I' | 'P' | 'Q' | undefined> {
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

export function bankAccountInputValidator(
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
    const transactionTypeValidator =
      transactionTypeInputValidator(transactionType);
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

export function dateInputValidator(input: string): ValidatorResult<string> {
  return {
    isError: false,
    errorMessage: '',
    checkedInput: input,
  };
}

export function accountIdInputValidator(
  input: string,
): ValidatorResult<string> {
  if (input.length !== SYSTEM_CONFIG.ACCOUNT_ID_LENGTH) {
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

export function transactionTypeInputValidator(
  input: string,
): ValidatorResult<TransactionType> {
  if (
    input !== TransactionType.DEPOSIT &&
    input !== TransactionType.WITHDRAWAL
  ) {
    return {
      isError: true,
      errorMessage: SYSTEM_ERRORS.INVALID_INPUT,
      checkedInput: TransactionType.DEPOSIT,
    };
  }
  return {
    isError: false,
    errorMessage: '',
    checkedInput: input,
  };
}

export function amountInputValidator(input: string): ValidatorResult<number> {
  const amount = parseFloat(input);
  if (isNaN(amount)) {
    return {
      isError: true,
      errorMessage: SYSTEM_ERRORS.INVALID_INPUT,
      checkedInput: 0,
    };
  }
  return {
    isError: false,
    errorMessage: '',
    checkedInput: amount,
  };
}
