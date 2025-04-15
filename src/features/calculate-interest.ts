import { SYSTEM_CONFIG } from '../config/system';
import { InterestRule } from '../entities/interest-rule';
import { SystemError } from '../error';
import { checkLeapYear, dateDifference, formatDate, previousDay } from '../utils/date-utils';
import { round } from '../utils/number-util';
import { generateInterestCheckpoint } from './generate-interest-checkpoint';
import { MonthBalanceCheckpoint } from './generate-month-balance-checkpoint';

export function calculateInterestRateValue(
  monthBalanceCheckpoint: MonthBalanceCheckpoint[],
  period: string,
  interestRules: Map<string, InterestRule>,
) {
  const sortedInterestRules = Array.from(interestRules.values());
  let interestRate = 0;
  let fillerInterestRate = findStartMonthInterestRate(sortedInterestRules, period);
  for (let i = 1; i < monthBalanceCheckpoint.length; i++) {
    const previousTransaction = monthBalanceCheckpoint[i - 1];
    const currentTransaction = monthBalanceCheckpoint[i];
    if (!previousTransaction || !currentTransaction) {
      throw new SystemError('Transaction not found');
    }
    const startDate = formatDate(previousTransaction.date);
    const endDate = formatDate(currentTransaction.date);
    const checkInterestInPeriod = generateInterestCheckpoint(sortedInterestRules, startDate, endDate);
    if (checkInterestInPeriod.length > 0) {
      for (let j = 0; j < checkInterestInPeriod.length; j++) {
        const currentInterestRate = checkInterestInPeriod[j];
        const interestDate = formatDate(currentInterestRate.date);
        if (j === 0) {
          const startDaysDiff = dateDifference(startDate, previousDay(interestDate));
          const amount = calculateInterestByDays(
            previousTransaction.balance,
            startDaysDiff,
            currentInterestRate.previousRate,
          );
          interestRate += amount;
          fillerInterestRate = currentInterestRate.rate;
        }
        if (j === checkInterestInPeriod.length - 1) {
          const endDaysDiff = dateDifference(interestDate, previousDay(endDate));
          const amount = calculateInterestByDays(previousTransaction.balance, endDaysDiff, currentInterestRate.rate);
          interestRate += amount;
          fillerInterestRate = currentInterestRate.rate;
        } else {
          const nextInterestRate = checkInterestInPeriod[j + 1];
          if (nextInterestRate) {
            const nextInterestDate = formatDate(nextInterestRate.date);
            const daysDiff = dateDifference(interestDate, previousDay(nextInterestDate));
            const amount = calculateInterestByDays(previousTransaction.balance, daysDiff, currentInterestRate.rate);
            interestRate += amount;
            fillerInterestRate = currentInterestRate.rate;
          }
        }
      }
    } else {
      const daysDiff = dateDifference(startDate, endDate);
      const amount = calculateInterestByDays(previousTransaction.balance, daysDiff, fillerInterestRate);
      interestRate += amount;
    }
  }
  const isPeriodLeapYear = checkLeapYear(period);
  const roundedInterestRate = round(interestRate / (isPeriodLeapYear ? 366 : 365), 2);
  const amountWithInterest = monthBalanceCheckpoint[monthBalanceCheckpoint.length - 1].balance + roundedInterestRate;
  return {
    interestRate: roundedInterestRate,
    amountWithInterest,
  };
}

export function findStartMonthInterestRate(sortedInterestRules: InterestRule[], period: string) {
  const startDate = formatDate(`${period}01`);
  let rate: number = SYSTEM_CONFIG.DEFAULT_INTEREST_RATE;
  for (let i = 0; i < sortedInterestRules.length; i++) {
    const rule = sortedInterestRules[i];
    const ruleDate = formatDate(rule.date);
    if (startDate > ruleDate) {
      rate = sortedInterestRules[i].rate;
    } else {
      break;
    }
  }
  return rate;
}

export function calculateInterestByDays(amount: number, days: number, rate: number) {
  return amount * days * (rate / 100);
}
