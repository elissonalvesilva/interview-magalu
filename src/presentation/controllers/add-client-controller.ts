import { ok } from './../helpers/http-helpers';
import { InvalidParamError, MissingParamError } from '../erros';
import { badRequest } from '../helpers/http-helpers';
import { Controller, HttpResponse } from '../protocols';
import { EmailValidator } from 'presentation/protocols/email-validator';

export class AddClientController implements Controller {
  constructor(private emailValidator: EmailValidator) {}

  async handle(request: any): Promise<HttpResponse> {
    const requiredFields = ['name', 'email'];

    for (const field of requiredFields) {
      if (!request.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }

    const isValidEmail = this.emailValidator.isValidEmail(request.email);
    if (!isValidEmail) {
      return badRequest(new InvalidParamError('email'));
    }

    return Promise.resolve(ok(true));
  }
}
