import { CheckAccountByEmailRepository } from './../protocols/account/check-account-by-email-repository';
import { AddAccountRepository } from './../protocols/account/add-account-repository';
import { CriptograpyHasher } from './../protocols/criptography/criptography-hasher';
import { Account } from 'domain/protocols';
import { AddAccount } from './../../domain/use-cases/add-account';

export class DbAddAccount implements AddAccount {
  constructor(
    private readonly hasher: CriptograpyHasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository,
  ) {}

  async add(account: Account): Promise<boolean> {
    const exists = await this.checkAccountByEmailRepository.checkAccountByEmail(
      account.email,
    );
    let isValid = false;
    if (!exists) {
      const hashedPassword = await this.hasher.hash(account.password);
      isValid = await this.addAccountRepository.add({
        ...account,
        password: hashedPassword,
      });
    }
    return isValid;
  }
}
