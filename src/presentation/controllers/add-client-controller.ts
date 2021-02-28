import { ok } from './../helpers/http-helpers';
import { MissingParamError } from '../erros';
import { badRequest } from '../helpers/http-helpers';
import { Controller, HttpResponse } from '../protocols';

export class AddClientController implements Controller {
  async handle(request: any): Promise<HttpResponse> {
    const requiredFields = ['name', 'email'];

    for (const field of requiredFields) {
      if (!request.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }

    return Promise.resolve(ok(true));
  }
}
