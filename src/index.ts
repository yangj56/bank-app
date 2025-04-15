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
    const cinema = new Bank(SYSTEM_CONFIG.SYSTEM_NAME);
    await promptBankingOptions(cinema);
  } catch (error) {
    console.error(error);
    throw new SystemError('Error setting up Banking System');
  }
}

async function promptBankingOptions(bank: Bank): Promise<void> {
  try {
    let continuePrompting = true;
    while (continuePrompting) {
      const optionInput = await inputQuestionRepromptor(
        `Welcome to ${SYSTEM_CONFIG.SYSTEM_NAME}! What would you like to do?`,
        optionInputValidator,
      );
      switch (optionInput) {
        case 'T': {
          const input = await inputQuestionRepromptor(
            `Please enter transaction details in <Date> <Account> <Type> <Amount> format\n${SYSTEM_CONFIG.GO_BACK_STATEMENT}`,
            addTransactionInputValidator,
          );
          if (input) {
            try {
              bank.addTransaction(...input);
            } catch (error) {
              if (error instanceof SystemError) {
                console.log(error.message);
              } else {
                console.error(error);
              }
            }
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

            console.log(`Interest for ${input[0]} in ${input[1]} is ${result}`);
          }
          break;
        }
        case 'Q':
          continuePrompting = false;
          break;
      }
    }
    console.log(`Thank you for banking with ${SYSTEM_CONFIG.SYSTEM_NAME}.\nHave a nice day!`);
    rl.close();
  } catch (error) {
    console.error(error);
    throw new SystemError('Error prompting banking options');
  }
}

promptBankSystemSetup();
