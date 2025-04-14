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

export class CinemaError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = 'CinemaError';
  }
}

export class BookingError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = 'BookingError';
  }
}

export class SeatAssignmentError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = 'SeatAssignmentError';
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
