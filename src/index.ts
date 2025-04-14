import { SYSTEM_CONFIG } from './config/system';
import { Bank } from './entities/bank';
import { SystemError } from './error';
import { inputQuestionRepromptor, rl } from './options/prompt-input-helper';
import {
  bankAccountInputValidator,
  optionInputValidator,
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
        `Welcome to AwesomeGIC Bank! What would you like to do?`,
        optionInputValidator,
      );
      switch (optionInput) {
        case 'T': {
          const optionInput = await inputQuestionRepromptor(
            `Please enter transaction details in <Date> <Account> <Type> <Amount> format\n(or enter blank to go back to main menu):`,
            bankAccountInputValidator,
          );
          break;
        }
        case 'I': {
          // TODO: Implement interest calculation
          break;
        }
        case 'P':
          // TODO: Implement print statement
          break;
        case 'Q':
          continuePrompting = false;
          break;
      }
    }
    console.log(`Thank you for using ${SYSTEM_CONFIG.SYSTEM_NAME}. Bye!`);
    rl.close();
  } catch (error) {
    console.error(error);
    throw new SystemError('Error prompting booking options');
  }
}

promptBankSystemSetup();
