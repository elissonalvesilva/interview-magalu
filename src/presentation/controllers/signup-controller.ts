import { EmailValidator } from './../protocols/email-validator';
import { InvalidParamError } from './../erros/invalid-param-error';
import { Authentication } from './../../domain/use-cases/authentication';
import { AddAccount } from './../../domain/use-cases/add-account';
import { Controller } from './../protocols/controller';
import { MissingParamError } from './../erros/missing-param-error';
import { HttpResponse } from './../protocols/http';
import { EmailInUseError } from './../erros/email-in-use-error';
import {
  badRequest,
  ok,
  serverError,
  forbidden,
} from './../helpers/http-helpers';

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private emailValidator: EmailValidator,
    private readonly authentication: Authentication,
  ) {}

  async handle(request: any): Promise<HttpResponse> {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation',
      ];

      for (const field of requiredFields) {
        if (!request[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const isValidEmail = this.emailValidator.isValidEmail(request.email);
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'));
      }

      const { name, email, password } = request;
      const isValid = await this.addAccount.add({
        name,
        email,
        password,
      });
      if (!isValid) {
        return forbidden(new EmailInUseError(request.email));
      }
      const authenticationModel = await this.authentication.auth({
        email,
        password,
      });
      return ok(authenticationModel);
    } catch (error) {
      return serverError(error);
    }
  }
}
