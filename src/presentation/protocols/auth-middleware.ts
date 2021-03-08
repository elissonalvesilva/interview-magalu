import { AccessDeniedError } from './../erros';
import { GetAccountByToken } from './../../domain/use-cases';
import { serverError, forbidden, ok } from './../helpers';
import { Middleware } from './middleware';
import { HttpResponse } from './http';

export class AuthMiddleware implements Middleware {
  constructor(private readonly loadAccountByToken: GetAccountByToken) {}

  async handle(request: any): Promise<HttpResponse> {
    try {
      const { accessToken } = request;
      if (accessToken) {
        const account = await this.loadAccountByToken.load(accessToken);
        if (account) {
          return ok({ accountId: account.id });
        }
      }
      return forbidden(new AccessDeniedError());
    } catch (error) {
      return serverError(error);
    }
  }
}
