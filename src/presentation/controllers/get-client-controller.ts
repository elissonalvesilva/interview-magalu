import { GetClient } from './../../domain/use-cases/get-client';
import {
  MissingParamError,
  NotFoundParamError,
} from './../../presentation/erros';
import {
  badRequest,
  notFound,
  ok,
  serverError,
} from './../../presentation/helpers/http-helpers';
import { HttpResponse } from 'presentation/protocols';
import { Controller } from './../protocols/controller';

export class GetClientController implements Controller {
  constructor(private getClient: GetClient) {}

  async handle(request: any): Promise<HttpResponse> {
    try {
      const requiredFields = ['id'];

      for (const field of requiredFields) {
        if (!request[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const client = await this.getClient.get(request.id);

      if (Object.keys(client).length === 0) {
        return notFound(new NotFoundParamError(request.id));
      }

      return ok(client);
    } catch (error) {
      return serverError(error);
    }
  }
}
