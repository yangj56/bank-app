import { Bank } from '../entities/bank';
import { SystemError } from '../error';

export function getAccount(accountId: string, bank: Bank) {
  const account = bank.accounts.find((account) => account.id === accountId);
  if (!account) {
    throw new SystemError('Account not found');
  }
  return account;
}
