import { CheckAccountByEmailRepository } from './../../../application/protocols/account/check-account-by-email-repository';
import { Account } from './../../../domain/protocols';
import { AddAccountRepository } from './../../../application/protocols/account/add-account-repository';
import AccountModel from './../mongodb/models/Account';
import {
  AccountResponse,
  GetAccountByEmailRepository,
  GetAccountByTokenRepository,
  GetAccountByTokenRepositoryResponse,
  UpdateAccessTokenRepository,
} from './../../../../src/application/protocols/account';

export class AccountMongoRepository
  implements
    AddAccountRepository,
    CheckAccountByEmailRepository,
    GetAccountByEmailRepository,
    UpdateAccessTokenRepository,
    GetAccountByTokenRepository {
  async add(account: Account): Promise<boolean> {
    const accountResp = await AccountModel.create(account);
    return accountResp !== null;
  }

  async checkAccountByEmail(email: string): Promise<boolean> {
    const account = await AccountModel.findOne({ email });
    return account !== null;
  }

  async loadByEmail(email: string): Promise<AccountResponse | null> {
    const accountClient = await AccountModel.findOne(
      { email },
      {
        _id: 1,
        name: 1,
        email: 1,
        password: 1,
      },
    );

    if (accountClient) {
      if (accountClient._id) {
        const accountResponse: AccountResponse = {
          id: accountClient._id,
          name: accountClient.name,
          email: accountClient.email,
          password: accountClient.password,
        };
        return accountResponse;
      }
    }

    return null;
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    await AccountModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          accessToken: token,
        },
      },
    );
  }

  async loadByToken(
    token: string,
  ): Promise<GetAccountByTokenRepositoryResponse | null> {
    const account = await AccountModel.findOne(
      {
        accessToken: token,
      },
      {
        _id: 1,
      },
    );

    if (account) {
      if (account._id) {
        const accountResponse: GetAccountByTokenRepositoryResponse = {
          id: account._id,
        };
        return accountResponse;
      }
    }
    return null;
  }
}
