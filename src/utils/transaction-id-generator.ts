import { SYSTEM_CONFIG } from '../config/system';

export function getNextTransactionId(date: string, counter: number): string {
  return `${date}-${counter.toString().padStart(SYSTEM_CONFIG.TRANSACTION_ID_LENGTH, '0')}`;
}
