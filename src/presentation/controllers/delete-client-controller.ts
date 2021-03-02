import { DeleteClient } from './../../domain/use-cases';
import { notFound, ok, serverError } from './../helpers/http-helpers';
import { NotFoundParamError } from './../erros/not-found-param-error';
import { MissingParamError } from './../../presentation/erros';
import { badRequest } from './../../presentation/helpers/http-helpers';
import { HttpResponse } from './../../presentation/protocols';
import { Controller } from './../protocols/controller';
import { SuccessRemove } from './../../presentation/helpers';

export class DeleteClientController implements Controller {
  constructor(private deleteClient: DeleteClient) {}

  async handle(request: any): Promise<HttpResponse> {
    try {
      const requiredFields = ['id'];

      for (const field of requiredFields) {
        if (!request[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const deletedClient = await this.deleteClient.delete(request.id);

      if (!deletedClient) {
        return notFound(new NotFoundParamError(request.id));
      }

      return ok(SuccessRemove(request.id));
    } catch (error) {
      return serverError(error);
    }
  }
}
