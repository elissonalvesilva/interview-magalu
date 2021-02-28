import { ok, serverError } from './../helpers/http-helpers';
import { InvalidParamError, MissingParamError } from '../erros';
import { badRequest } from '../helpers/http-helpers';
import { Controller, HttpResponse } from '../protocols';
import { EmailValidator } from 'presentation/protocols/email-validator';
import { AddClient } from 'domain/use-cases/add-client';

export class AddClientController implements Controller {
  constructor(
    private emailValidator: EmailValidator,
    private addClient: AddClient,
  ) {}

  async handle(request: any): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email'];

      for (const field of requiredFields) {
        if (!request[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const isValidEmail = this.emailValidator.isValidEmail(request.email);
      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'));
      }

      const validClient = await this.addClient.add(request);

      return ok(validClient);
    } catch (error) {
      return serverError(error);
    }
  }
}
