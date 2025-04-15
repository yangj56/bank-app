import { SystemError } from '../error';
import { formatDate } from '../utils/date-utils';
import { Account } from './account';
import { InterestRule } from './interest-rule';
import { TransactionType } from './transaction';

type CollapseTransactions = {
  date: string;
  balance: number;
  type: TransactionType;
  amount: number;
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

  printStatement(accountID: string, period: string) {
    const account = this.accounts.find((account) => account.id === accountID);
    if (!account) {
      throw new SystemError('Account not found');
    }

    const transactions = account.transactions.filter((transaction) => {
      if (this.dateIsInMonth(transaction.date, period)) {
        return transaction;
      }
    });

    console.log(transactions);

    const collapseTransactions: CollapseTransactions[] = [];
    for (let i = 1; i < transactions.length; i++) {
      const previousTransaction = transactions[i - 1];
      const currentTransaction = transactions[i];
      if (previousTransaction && previousTransaction.date === currentTransaction.date) {
        collapseTransactions.pop();
      }
      collapseTransactions.push({
        date: currentTransaction.date,
        balance: currentTransaction.balance,
        type: currentTransaction.type,
        amount: currentTransaction.amount,
      });
    }

    const sortedInterestRules = Array.from(this.interestRules.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    let interestRate = 0;
    for (let i = 1; i < collapseTransactions.length; i++) {
      const previousTransaction = collapseTransactions[i - 1];
      const currentTransaction = collapseTransactions[i];
      if (!previousTransaction || !currentTransaction) {
        throw new SystemError('Transaction not found');
      }
      const checkInterestInPeriod = this.findAllInterestInPeriod(
        sortedInterestRules,
        previousTransaction.date,
        currentTransaction.date,
      );
      for (let j = 1; j < checkInterestInPeriod.length; j++) {
        const previousInterestRate = checkInterestInPeriod[j - 1];
        const currentInterestRate = checkInterestInPeriod[j];
        if (!previousInterestRate || !currentInterestRate) {
          throw new SystemError('Interest rate not found');
        }
        if (previousInterestRate) {
          const days = this.dateDifference(previousInterestRate.date, currentInterestRate.date);
          if (currentInterestRate.date < currentTransaction.date) {
            const amount = previousTransaction.balance * days * previousInterestRate.rate;
            interestRate = interestRate + amount;
          }
        }
      }
    }
  }

  private dateDifference(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }

  private dateIsInMonth(checkDate: string, periodMonth: string): boolean {
    const date = new Date(checkDate);
    const period = new Date(periodMonth);
    return date.getMonth() === period.getMonth() && date.getFullYear() === period.getFullYear();
  }

  private findAllInterestInPeriod(sortedInterestRules: InterestRule[], startDate: string, endDate: string) {
    let firstInterestRule: InterestRule | undefined;
    const interestRules = sortedInterestRules.filter((rule, index) => {
      if (rule.date >= startDate && rule.date <= endDate) {
        if (rule.date > startDate && firstInterestRule === undefined && index !== 0) {
          firstInterestRule = sortedInterestRules[index - 1];
        }
        return rule;
      }
    });
    if (firstInterestRule) {
      interestRules.unshift(firstInterestRule);
    }
    return interestRules;
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
}
