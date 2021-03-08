import { AuthMiddleware } from './../../../presentation/protocols';
import { makeDbGetAccountByToken } from '../use-cases/account';
import { Middleware } from './../../../presentation/protocols/middleware';
export const makeAuthMiddleware = (): Middleware => {
  return new AuthMiddleware(makeDbGetAccountByToken());
};
