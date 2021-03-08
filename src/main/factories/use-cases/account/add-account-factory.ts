import { DbAddAccount } from './../../../../application/use-cases/db-add-account';
import { AccountMongoRepository } from './../../../../infrastructure/database/mongodb/account-mongo-repository';
import { AddAccount } from './../../../../domain/use-cases/add-account';
import { BcryptAdapter } from './../../../../infrastructure/criptography/bcrypt-adapter';

export const createDbAddAccount = (): AddAccount => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  return new DbAddAccount(
    bcryptAdapter,
    accountMongoRepository,
    accountMongoRepository,
  );
};
