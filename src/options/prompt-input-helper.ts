import { ValidationError } from '../error';
import readline from 'readline';

/**
 * Prompts the user for input and reprompts until the input is valid
 * @param query - The query to prompt the user with
 * @param inputValidator - The validator function to use
 * @returns The validated input
 */
export async function inputQuestionRepromptor<T>(
  query: string,
  inputValidator: (input: string) => {
    isError: boolean;
    errorMessage: string | null;
    checkedInput: T;
  },
): Promise<T> {
  try {
    const input = await question(`${query} \n> `);
    const { isError, errorMessage, checkedInput } = inputValidator(input);
    if (isError) {
      console.error(errorMessage);
      return inputQuestionRepromptor(query, inputValidator);
    }
    return checkedInput;
  } catch (error) {
    handleError(error);
    return inputQuestionRepromptor(query, inputValidator);
  }
}

/**
 * Creates a readline interface for reading input from the console
 * @returns The readline interface
 */
export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function handleError(error: unknown): void {
  if (error instanceof ValidationError) {
    console.error('Validation Error:', error.message);
  } else {
    console.error(
      'Error:',
      error instanceof Error ? error.message : 'Unknown error',
    );
  }
}

function question(query: string): Promise<string> {
  return new Promise((resolve) => rl.question(query, resolve));
}
