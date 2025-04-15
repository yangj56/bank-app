import { SYSTEM_CONFIG } from './config/system';
import { Bank } from './entities/bank';
import { SystemError } from './error';
import { inputQuestionRepromptor, rl } from './options/prompt-input-helper';
import {
  addInterestRuleInputValidator,
  addTransactionInputValidator,
  optionInputValidator,
  printStatementInputValidator,
} from './options/prompt-input-validator';

async function promptBankSystemSetup(): Promise<void> {
  try {
    const bank = new Bank(SYSTEM_CONFIG.SYSTEM_NAME);
    await promptBankingOptions(bank);
  } catch (error) {
    console.error(error);
    throw new SystemError('Error setting up Banking System');
  }
}

async function promptBankingOptions(bank: Bank): Promise<void> {
  let continuePrompting = true;
  let checkMessage = `Welcome to ${SYSTEM_CONFIG.SYSTEM_NAME}! What would you like to do?`;
  while (continuePrompting) {
    try {
      const optionInput = await inputQuestionRepromptor(
        `${checkMessage}\n[T] Input transactions\n[I] Define interest rules\n[P] Print statement\n[Q] Quit`,
        optionInputValidator,
      );
      switch (optionInput) {
        case 'T': {
          const input = await inputQuestionRepromptor(
            `Please enter transaction details in <Date> <Account> <Type> <Amount> format\n${SYSTEM_CONFIG.GO_BACK_STATEMENT}`,
            addTransactionInputValidator,
          );
          if (input) {
            const accountId = bank.addTransaction(...input);
            bank.printTransactions(accountId);
          }
          break;
        }
        case 'I': {
          const input = await inputQuestionRepromptor(
            `Please enter interest rules details in <Date> <RuleId> <Rate in %> format\n${SYSTEM_CONFIG.GO_BACK_STATEMENT}`,
            addInterestRuleInputValidator,
          );
          if (input) {
            bank.addInterestRule(...input);
            bank.printInterestRules();
          }
          break;
        }
        case 'P': {
          const input = await inputQuestionRepromptor(
            `Please enter account and month to generate the statement <Account> <Year><Month>\n${SYSTEM_CONFIG.GO_BACK_STATEMENT}`,
            printStatementInputValidator,
          );
          if (input) {
            const result = bank.calculatePeriodInterest(...input);
            bank.printStatement(
              result.transactions,
              result.interestRate,
              result.amountWithInterest,
              result.accountID,
              result.period,
            );
          }
          break;
        }
        case 'Q':
          continuePrompting = false;
          break;
      }
      checkMessage = `Is there anything else you'd like to do?`;
    } catch (error) {
      if (error instanceof Error) {
        console.log(`${error.message}`);
      } else {
        console.log(`${error}`);
      }
    }
  }
  console.log(`Thank you for banking with ${SYSTEM_CONFIG.SYSTEM_NAME}.\nHave a nice day!`);
  rl.close();
}

promptBankSystemSetup();
