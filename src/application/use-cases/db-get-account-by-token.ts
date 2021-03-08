import { CriptograpyDecrypter } from './../protocols/criptography/criptography-decrypt';
import {
  GetAccountByTokenRepository,
  GetAccountByTokenRepositoryResponse,
} from './../protocols/account/get-account-by-token-repository';
import { GetAccountByToken } from './../../domain/use-cases/get-account-by-token';

export class DbGetAccountByToken implements GetAccountByToken {
  constructor(
    private readonly decrypter: CriptograpyDecrypter,
    private readonly getAccountByTokenRepository: GetAccountByTokenRepository,
  ) {}

  async load(
    accessToken: string,
  ): Promise<GetAccountByTokenRepositoryResponse | null> {
    let token: string;
    try {
      token = await this.decrypter.decrypt(accessToken);
    } catch (error) {
      return null;
    }
    if (token) {
      const account = await this.getAccountByTokenRepository.loadByToken(
        accessToken,
      );
      if (account) {
        return account;
      }
    }
    return null;
  }
}
