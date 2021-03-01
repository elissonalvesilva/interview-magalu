import {
  serverError,
  badRequest,
  ok,
} from '../../presentation/helpers/http-helpers';
import { HttpResponse } from '../../presentation/protocols';
import { Controller } from './../protocols/controller';
import { MissingParamError } from '../../presentation/erros';

export class UpdateClientController implements Controller {
  async handle(request: any): Promise<HttpResponse> {
    try {
      const requiredFields = ['id', 'name', 'email'];

      for (const field of requiredFields) {
        if (!request[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      return ok(true);
    } catch (error) {
      return serverError(error);
    }
  }
}
