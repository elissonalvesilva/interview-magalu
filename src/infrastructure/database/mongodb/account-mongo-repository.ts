import { Account } from './../../../domain/protocols';
import { AddAccountRepository } from './../../../application/protocols/account/add-account-repository';
import AccountModel from './../mongodb/models/Account';

export class AccountMongoRepository implements AddAccountRepository {
  async add(account: Account): Promise<boolean> {
    const accountResp = await AccountModel.create(account);
    return accountResp !== null;
  }
}
