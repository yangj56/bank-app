import { SYSTEM_CONFIG } from '../config/system';
import { SystemError } from '../error';
import { calculateInterestRateValue } from '../features/calculate-interest';
import { generateMonthBalanceCheckpoint } from '../features/generate-month-balance-checkpoint';
import { getAccount } from '../repositories/account';
import { addInterestRuleByOrder, checkRuleIdExisted } from '../repositories/interest-rule';
import { getCalculatedTransactions, getTransactionCounter, getTransactionsInPeriod } from '../repositories/transaction';
import { getLastDayOfMonth } from '../utils/date-utils';
import { displayDecimal } from '../utils/number-util';
import { Account } from './account';
import { InterestRule } from './interest-rule';
import { Transaction, TransactionType } from './transaction';

export class Bank {
  name: string;
  accounts: Account[];
  interestRules: Map<string, InterestRule>;

  constructor(name: string) {
    this.name = name;
    this.accounts = [];
    this.interestRules = new Map();
  }

  public addTransaction(date: string, accountId: string, type: TransactionType, amount: number) {
    const account = this.accounts.find((account) => account.id === accountId);
    const transactionCount = getTransactionCounter(date, accountId, this, account);

    if (!account) {
      if (type === TransactionType.DEPOSIT) {
        const newAccount = new Account(accountId);
        newAccount.deposit(amount, date, transactionCount);
        this.accounts.push(newAccount);
      } else {
        throw new SystemError('First transaction must be a deposit');
      }
    } else {
      if (type === TransactionType.DEPOSIT) {
        account.deposit(amount, date, transactionCount);
      } else {
        account.withdraw(amount, date, transactionCount);
      }
    }
    return accountId;
  }

  public addInterestRule(date: string, ruleId: string, rate: number) {
    if (checkRuleIdExisted(this.interestRules, ruleId)) {
      throw new SystemError('Rule ID already exists');
    }
    const interestRule = new InterestRule(date, ruleId, rate);
    if (this.interestRules.has(date)) {
      this.interestRules.set(date, interestRule);
    } else {
      this.interestRules = addInterestRuleByOrder(this.interestRules, date, interestRule);
    }
  }

  public calculatePeriodInterest(accountID: string, period: string) {
    const account = getAccount(accountID, this);
    const transactions = getTransactionsInPeriod(accountID, this, period);
    const calculatedTransactions = getCalculatedTransactions(account, period, transactions);
    if (calculatedTransactions.length === 0) {
      return {
        transactions,
        interestRate: 0,
        amountWithInterest: 0,
        accountID,
        period,
      };
    }
    const monthBalanceCheckpoint = generateMonthBalanceCheckpoint(calculatedTransactions, period);
    const { interestRate, amountWithInterest } = calculateInterestRateValue(
      monthBalanceCheckpoint,
      period,
      this.interestRules,
    );
    return {
      transactions,
      interestRate,
      amountWithInterest,
      accountID,
      period,
    };
  }

  public printTransactions(accountId: string) {
    const account = this.accounts.find((account) => account.id === accountId);
    if (!account) {
      throw new SystemError('Account not found');
    }
    const transactions = account.transactions;
    let display = `Account: ${accountId}\n`;
    display += `| ${'Date'.padEnd(SYSTEM_CONFIG.DATE_PADDING)} | ${'Txn Id'.padEnd(SYSTEM_CONFIG.TRANSACTION_PADDING)} | ${'Type'.padEnd(SYSTEM_CONFIG.TRANSACTION_TYPE_PADDING)} | ${'Amount'.padStart(SYSTEM_CONFIG.AMOUNT_PADDING)} |\n`;
    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];
      display += `| ${transaction.date.padEnd(SYSTEM_CONFIG.DATE_PADDING)} | ${transaction.id.padEnd(SYSTEM_CONFIG.TRANSACTION_PADDING)} | ${transaction.type.padEnd(SYSTEM_CONFIG.TRANSACTION_TYPE_PADDING)} | ${displayDecimal(transaction.amount, 2).toString().padStart(SYSTEM_CONFIG.AMOUNT_PADDING)} |\n`;
    }
    console.log(display);
  }

  public printInterestRules() {
    const interestRules = Array.from(this.interestRules.values());
    let display = `Interest Rules:\n`;
    display += `| ${'Date'.padEnd(SYSTEM_CONFIG.DATE_PADDING)} | ${'RuleId'.padEnd(SYSTEM_CONFIG.RULE_PADDING)} | ${'Rate (%)'.padStart(SYSTEM_CONFIG.RATE_PADDING)} |\n`;
    for (let i = 0; i < interestRules.length; i++) {
      const interestRule = interestRules[i];
      display += `| ${interestRule.date.padEnd(SYSTEM_CONFIG.DATE_PADDING)} | ${interestRule.ruleId.padEnd(SYSTEM_CONFIG.RULE_PADDING)} | ${displayDecimal(interestRule.rate, 2).toString().padStart(SYSTEM_CONFIG.RATE_PADDING)} |\n`;
    }
    console.log(display);
  }

  public printStatement(
    transactions: Transaction[],
    interestRate: number,
    amountWithInterest: number,
    accountID: string,
    period: string,
  ) {
    const lastDay = getLastDayOfMonth(period);
    let display = `Account: ${accountID}\n`;
    display += `| ${'Date'.padEnd(SYSTEM_CONFIG.DATE_PADDING)} | ${'Txn Id'.padEnd(SYSTEM_CONFIG.TRANSACTION_PADDING)} | ${'Type'.padEnd(SYSTEM_CONFIG.TRANSACTION_TYPE_PADDING)} | ${'Amount'.padStart(SYSTEM_CONFIG.AMOUNT_PADDING)} | ${'Balance'.padStart(SYSTEM_CONFIG.BALANCE_PADDING)} |\n`;
    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];
      display += `| ${transaction.date.padEnd(SYSTEM_CONFIG.DATE_PADDING)} | ${transaction.id.padEnd(SYSTEM_CONFIG.TRANSACTION_PADDING)} | ${transaction.type.padEnd(SYSTEM_CONFIG.TRANSACTION_TYPE_PADDING)} | ${displayDecimal(transaction.amount, 2).toString().padStart(SYSTEM_CONFIG.AMOUNT_PADDING)} | ${displayDecimal(transaction.balance, 2).toString().padStart(SYSTEM_CONFIG.BALANCE_PADDING)} |\n`;
    }
    display += `| ${lastDay.padEnd(SYSTEM_CONFIG.DATE_PADDING)} | ${''.padEnd(SYSTEM_CONFIG.TRANSACTION_PADDING)} | ${'I'.padEnd(SYSTEM_CONFIG.TRANSACTION_TYPE_PADDING)} | ${interestRate.toString().padStart(SYSTEM_CONFIG.AMOUNT_PADDING)} | ${amountWithInterest.toString().padStart(SYSTEM_CONFIG.BALANCE_PADDING)} |\n`;
    console.log(display);
  }
}
