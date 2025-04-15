import { SYSTEM_CONFIG } from '../config/system';
import { SystemError } from '../error';
import {
  checkLeapYear,
  dateDifference,
  displayDecimal,
  formatDate,
  getLastDayOfMonth,
  isDayInSameYearMonth,
  isFirstDayOfMonth,
  isLastDayOfMonth,
  previousDay,
} from '../utils/date-utils';
import { round } from '../utils/number-util';
import { Account } from './account';
import { InterestRule } from './interest-rule';
import { Transaction, TransactionType } from './transaction';

type MonthBalanceCheckpoint = {
  date: string;
  balance: number;
};

type InterestCheckpoint = {
  date: string;
  rate: number;
  previousRate: number;
};

export class Bank {
  name: string;
  accounts: Account[];
  interestRules: Map<string, InterestRule>;

  constructor(name: string) {
    this.name = name;
    this.accounts = [];
    this.interestRules = new Map();
  }

  addTransaction(date: string, accountId: string, type: TransactionType, amount: number) {
    const account = this.accounts.find((account) => account.id === accountId);
    if (!account) {
      if (type === TransactionType.DEPOSIT) {
        const newAccount = new Account(accountId);
        newAccount.deposit(amount, date);
        this.accounts.push(newAccount);
      } else {
        throw new SystemError('First transaction must be a deposit');
      }
    } else {
      if (type === TransactionType.DEPOSIT) {
        account.deposit(amount, date);
      } else {
        account.withdraw(amount, date);
      }
    }
  }

  addInterestRule(date: string, ruleId: string, rate: number) {
    if (this.ruleIdExisted(ruleId)) {
      throw new SystemError('Rule ID already exists');
    }
    this.interestRules.forEach((rule) => {
      if (rule.date === date) {
        this.interestRules.delete(date);
      }
    });
    const interestRule = new InterestRule(date, ruleId, rate);
    if (this.interestRules.has(date)) {
      this.interestRules.set(date, interestRule);
    } else {
      this.interestRules = this.insertByOrder(this.interestRules, date, interestRule);
    }
  }

  public calculatePeriodInterest(accountID: string, period: string) {
    const account = this.accounts.find((account) => account.id === accountID);
    if (!account) {
      throw new SystemError('Account not found');
    }

    const transactions = account.transactions.filter((transaction) => {
      if (isDayInSameYearMonth(transaction.date, period)) {
        return transaction;
      }
    });
    console.log(`transactions`, transactions);
    let calculatedTransactions = [...transactions];
    if (calculatedTransactions.length === 0) {
      for (let i = 0; i < account.transactions.length; i++) {
        const transaction = account.transactions[i];
        const transactionDate = formatDate(transaction.date);
        const startDate = formatDate(`${period}01`);
        if (startDate > transactionDate && i > 0 && calculatedTransactions.length === 0) {
          const previousTransaction = account.transactions[i - 1];
          if (previousTransaction) {
            calculatedTransactions.push(previousTransaction);
          }
        }
      }
    }
    console.log(`transactions`, transactions);
    if (calculatedTransactions.length === 0) {
      return {
        interestRate: 0,
        amountWithInterest: 0,
        transactions: [],
      };
    }
    const monthBalanceCheckpoint = this.generateMonthBalanceCheckpoint(calculatedTransactions, period);
    console.log(`monthBalanceCheckpoint`, monthBalanceCheckpoint);
    const { interestRate, amountWithInterest } = this.calculateInterestRateValue(monthBalanceCheckpoint, period);
    return {
      interestRate,
      amountWithInterest,
      transactions,
    };
  }

  public printStatement(
    transactions: Transaction[],
    interestRate: number,
    amountWithInterest: number,
    accountID: string,
    period: string,
  ) {
    const lastDay = getLastDayOfMonth(period);
    let display = `Account: ${accountID}`;
    display += `| ${'Date'.padEnd(SYSTEM_CONFIG.DATE_PADDING)} | ${'Txn Id'.padEnd(SYSTEM_CONFIG.TRANSACTION_PADDING)} | ${'Type'.padEnd(SYSTEM_CONFIG.TRANSACTION_TYPE_PADDING)} | ${'Amount'.padStart(SYSTEM_CONFIG.AMOUNT_PADDING)} | ${'Balance'.padStart(SYSTEM_CONFIG.BALANCE_PADDING)}\n`;
    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];
      display += `| ${transaction.date.padEnd(SYSTEM_CONFIG.DATE_PADDING)} | ${transaction.id.padEnd(SYSTEM_CONFIG.TRANSACTION_PADDING)} | ${transaction.type.padEnd(SYSTEM_CONFIG.TRANSACTION_TYPE_PADDING)} | ${displayDecimal(transaction.amount).toString().padStart(SYSTEM_CONFIG.AMOUNT_PADDING)} | ${displayDecimal(transaction.balance).toString().padStart(SYSTEM_CONFIG.BALANCE_PADDING)}\n`;
    }
    display += `| ${lastDay.padEnd(SYSTEM_CONFIG.DATE_PADDING)} | ${''.padEnd(SYSTEM_CONFIG.TRANSACTION_PADDING)} | ${'I'.padEnd(SYSTEM_CONFIG.TRANSACTION_TYPE_PADDING)} | ${interestRate.toString().padStart(SYSTEM_CONFIG.AMOUNT_PADDING)} | ${amountWithInterest.toString().padStart(SYSTEM_CONFIG.BALANCE_PADDING)}\n`;
    console.log(display);
  }

  private calculateInterestRateValue(monthBalanceCheckpoint: MonthBalanceCheckpoint[], period: string) {
    const sortedInterestRules = Array.from(this.interestRules.values());
    let interestRate = 0;
    let fillerInterestRate = this.findStartMonthInterestRate(sortedInterestRules, period);
    console.log(`startMonthInterestRate`, fillerInterestRate);
    for (let i = 1; i < monthBalanceCheckpoint.length; i++) {
      const previousTransaction = monthBalanceCheckpoint[i - 1];
      const currentTransaction = monthBalanceCheckpoint[i];
      if (!previousTransaction || !currentTransaction) {
        throw new SystemError('Transaction not found');
      }
      const startDate = formatDate(previousTransaction.date);
      const endDate = formatDate(currentTransaction.date);
      const checkInterestInPeriod = this.findAllInterestInPeriod(sortedInterestRules, startDate, endDate);
      console.log(`checkInterestInPeriod`, checkInterestInPeriod);
      if (checkInterestInPeriod.length > 0) {
        for (let j = 0; j < checkInterestInPeriod.length; j++) {
          const currentInterestRate = checkInterestInPeriod[j];
          const interestDate = formatDate(currentInterestRate.date);
          if (j === 0) {
            const startDaysDiff = dateDifference(startDate, previousDay(interestDate), 'start');
            const amount = this.calculateInterestByDays(
              previousTransaction.balance,
              startDaysDiff,
              currentInterestRate.previousRate,
            );
            interestRate += amount;
            fillerInterestRate = currentInterestRate.rate;
          }
          if (j === checkInterestInPeriod.length - 1) {
            const endDaysDiff = dateDifference(interestDate, previousDay(endDate), 'end');
            const amount = this.calculateInterestByDays(
              previousTransaction.balance,
              endDaysDiff,
              currentInterestRate.rate,
            );
            interestRate += amount;
            fillerInterestRate = currentInterestRate.rate;
          } else {
            const nextInterestRate = checkInterestInPeriod[j + 1];
            if (nextInterestRate) {
              const nextInterestDate = formatDate(nextInterestRate.date);
              const daysDiff = dateDifference(interestDate, previousDay(nextInterestDate), 'middle');
              const amount = this.calculateInterestByDays(
                previousTransaction.balance,
                daysDiff,
                currentInterestRate.rate,
              );
              interestRate += amount;
              fillerInterestRate = currentInterestRate.rate;
            }
          }
        }
      } else {
        const daysDiff = dateDifference(startDate, endDate, 'last');
        const amount = this.calculateInterestByDays(previousTransaction.balance, daysDiff, fillerInterestRate);
        interestRate += amount;
      }
    }
    const isPeriodLeapYear = checkLeapYear(period);
    console.log(`isPeriodLeapYear`, isPeriodLeapYear);
    const roundedInterestRate = round(interestRate / (isPeriodLeapYear ? 366 : 365), 2);
    const amountWithInterest = monthBalanceCheckpoint[monthBalanceCheckpoint.length - 1].balance + roundedInterestRate;
    return {
      interestRate: roundedInterestRate,
      amountWithInterest,
    };
  }

  private calculateInterestByDays(amount: number, days: number, rate: number) {
    console.log(`amount ${amount} days ${days} rate ${rate}`);
    return amount * days * (rate / 100);
  }

  private findAllInterestInPeriod(sortedInterestRules: InterestRule[], startDate: Date, endDate: Date) {
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

  private generateMonthBalanceCheckpoint(transactions: Transaction[], period: string) {
    const monthBalanceCheckpoint: MonthBalanceCheckpoint[] = [];
    for (let i = 0; i < transactions.length; i++) {
      const currentTransaction = transactions[i];
      if (isDayInSameYearMonth(currentTransaction.date, period)) {
        if (i !== 0) {
          const previousTransaction = transactions[i - 1];
          if (previousTransaction && previousTransaction.date === currentTransaction.date) {
            monthBalanceCheckpoint.pop();
          }
        }
        if (i === 0) {
          const firstCollapseTransaction = transactions[0];
          const firstDay = isFirstDayOfMonth(firstCollapseTransaction.date, period);
          if (!firstDay.isFirstDayOfMonth) {
            monthBalanceCheckpoint.push({
              date: firstDay.day,
              balance: firstCollapseTransaction.previousBalance,
            });
          }
        }
        monthBalanceCheckpoint.push({
          date: currentTransaction.date,
          balance: currentTransaction.balance,
        });
        if (i === transactions.length - 1) {
          const lastCollapseTransaction = transactions[transactions.length - 1];
          const lastDay = isLastDayOfMonth(lastCollapseTransaction.date, period);
          if (!lastDay.isLastDayOfMonth) {
            monthBalanceCheckpoint.push({
              date: lastDay.day,
              balance: lastCollapseTransaction.balance,
            });
          }
        }
      } else {
        const periodFirstDay = `${period}01`;
        const periodLastDay = getLastDayOfMonth(period);
        monthBalanceCheckpoint.push({
          date: periodFirstDay,
          balance: currentTransaction.balance,
        });
        monthBalanceCheckpoint.push({
          date: periodLastDay,
          balance: currentTransaction.balance,
        });
      }
    }
    return monthBalanceCheckpoint;
  }

  private insertByOrder(map: Map<string, InterestRule>, newKey: string, newValue: InterestRule) {
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

  private ruleIdExisted(ruleId: string) {
    for (let value of this.interestRules.values()) {
      if (value.ruleId === ruleId) {
        return true;
      }
    }
    return false;
  }

  private findStartMonthInterestRate(sortedInterestRules: InterestRule[], period: string) {
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
}
