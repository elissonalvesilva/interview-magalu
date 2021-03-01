import { UpdateClient } from './../../domain/use-cases/update-client';
import {
  serverError,
  badRequest,
  ok,
  notFound,
} from '../../presentation/helpers/http-helpers';
import { HttpResponse } from '../../presentation/protocols';
import { Controller } from './../protocols/controller';
import {
  MissingParamError,
  NotFoundParamError,
} from '../../presentation/erros';

export class UpdateClientController implements Controller {
  constructor(private updateClient: UpdateClient) {}

  async handle(request: any): Promise<HttpResponse> {
    try {
      const requiredFields = ['id', 'name', 'email'];

      for (const field of requiredFields) {
        if (!request[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const updatedClient = await this.updateClient.update(request);

      if (!updatedClient) {
        return notFound(new NotFoundParamError(request.id));
      }

      return ok(updatedClient);
    } catch (error) {
      return serverError(error);
    }
  }
}
