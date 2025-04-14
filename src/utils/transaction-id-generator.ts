import { SYSTEM_CONFIG } from '../config/system';

/**
 * Generates a unique booking ID
 * @returns The generated auto increment booking ID
 */
let transactionId = 0;
export function getNextTransactionId(date: string): string {
  transactionId++;
  return `${date}-${transactionId.toString().padStart(SYSTEM_CONFIG.TRANSACTION_ID_LENGTH, '0')}`;
}
