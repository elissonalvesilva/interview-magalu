import { Account } from './../protocols/account';

export interface AddAccount {
  add(account: Account): Promise<boolean>;
}
