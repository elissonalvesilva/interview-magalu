import { CheckAccountByEmailRepository } from './../../../application/protocols/account/check-account-by-email-repository';
import { Account } from './../../../domain/protocols';
import { AddAccountRepository } from './../../../application/protocols/account/add-account-repository';
import AccountModel from './../mongodb/models/Account';

export class AccountMongoRepository
  implements AddAccountRepository, CheckAccountByEmailRepository {
  async add(account: Account): Promise<boolean> {
    const accountResp = await AccountModel.create(account);
    return accountResp !== null;
  }

  async checkAccountByEmail(email: string): Promise<boolean> {
    const account = await AccountModel.findOne({ email });
    return account !== null;
  }
}
