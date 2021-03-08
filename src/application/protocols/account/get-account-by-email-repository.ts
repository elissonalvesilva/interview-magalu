import { Account } from './../../../domain/protocols/account';

export interface AccountResponse extends Account {
  _id: string;
}

export interface GetAccountByEmailRepository {
  loadByEmail: (email: string) => Promise<AccountResponse | null>;
}
