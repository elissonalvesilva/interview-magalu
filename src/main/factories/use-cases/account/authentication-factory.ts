import { BcryptAdapter } from './../../../../infrastructure/criptography/bcrypt-adapter';
import { JwtAdapter } from './../../../../infrastructure/criptography/jwt-adapter';
import { Authentication } from './../../../../domain/use-cases/authentication';
import { AccountMongoRepository } from './../../../../infrastructure/database/mongodb/account-mongo-repository';
import { DbAuthentication } from './../../../../application/use-cases/db-authentication';

export const createDbAuthentication = (): Authentication => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter(process.env.JWT_SECRET || 'ss56==02jj7');
  const accountMongoRepository = new AccountMongoRepository();
  return new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository,
  );
};
