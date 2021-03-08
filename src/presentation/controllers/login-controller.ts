import { InvalidParamError } from './../erros/invalid-param-error';
import { EmailValidator } from './../protocols/email-validator';
import { Authentication } from './../../domain/use-cases/authentication';
import { HttpResponse } from './../protocols/http';
import { Controller } from './../protocols/controller';
import { MissingParamError } from './../erros/missing-param-error';
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from './../../presentation/helpers';

export class LoginController implements Controller {
  constructor(
    private readonly authentication: Authentication,
    private emailValidator: EmailValidator,
  ) {}

  async handle(request: any): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password'];

      for (const field of requiredFields) {
        if (!request[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const isValidEmail = this.emailValidator.isValidEmail(request.email);
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'));
      }

      const authentication = await this.authentication.auth(request);
      if (!authentication) {
        return unauthorized();
      }

      return ok(authentication);
    } catch (error) {
      return serverError(error);
    }
  }
}
