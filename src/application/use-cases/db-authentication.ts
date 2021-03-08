import {
  GetAccountByEmailRepository,
  UpdateAccessTokenRepository,
} from './../../application/protocols/account';
import {
  CriptograpyEncrypter,
  CriptograpyHashComparer,
} from './../../application/protocols/criptography';
import { Authentication } from './../../domain/use-cases/authentication';
import {
  AuthenticationParams,
  AuthenticationResult,
} from './../../domain/protocols';

export class DbAuthentication implements Authentication {
  constructor(
    private readonly getAccountByEmailRepository: GetAccountByEmailRepository,
    private readonly hashComparer: CriptograpyHashComparer,
    private readonly encrypter: CriptograpyEncrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
  ) {}

  async auth(
    authenticationParams: AuthenticationParams,
  ): Promise<AuthenticationResult | null> {
    const account = await this.getAccountByEmailRepository.loadByEmail(
      authenticationParams.email,
    );
    if (account) {
      const isValid = await this.hashComparer.compare(
        authenticationParams.password,
        account.password,
      );
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account.id);
        await this.updateAccessTokenRepository.updateAccessToken(
          account.id,
          accessToken,
        );
        return {
          accessToken,
          name: account.name,
        };
      }
    }
    return null;
  }
}
