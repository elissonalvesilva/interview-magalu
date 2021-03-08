import { DbGetAccountByToken } from './../../../../application/use-cases/db-get-account-by-token';
import { AccountMongoRepository } from './../../../../infrastructure/database/mongodb/account-mongo-repository';
import { GetAccountByToken } from './../../../../domain/use-cases/get-account-by-token';
import { JwtAdapter } from './../../../../infrastructure/criptography/jwt-adapter';

export const makeDbGetAccountByToken = (): GetAccountByToken => {
  const jwtAdapter = new JwtAdapter(process.env.JWT_SECRET || 'ss56==02jj7');
  const accountMongoRepository = new AccountMongoRepository();
  return new DbGetAccountByToken(jwtAdapter, accountMongoRepository);
};
