export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class BankError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = 'BankError';
  }
}

export class ConfigurationError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

export class SystemError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = 'SystemError';
  }
}
