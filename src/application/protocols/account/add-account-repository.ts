import { Account } from './../../../domain/protocols/account';

export interface AddAccountRepository {
  add(account: Account): Promise<boolean>;
}
