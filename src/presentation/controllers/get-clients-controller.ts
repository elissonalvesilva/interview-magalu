import { GetClients } from './../../domain/use-cases';
import { ok, serverError } from './../../presentation/helpers/http-helpers';
import { HttpResponse } from './../../presentation/protocols';
import { Controller } from './../protocols/controller';

export class GetClientsController implements Controller {
  constructor(private getClients: GetClients) {}

  async handle(request: any): Promise<HttpResponse> {
    try {
      const client = await this.getClients.getClients();
      return ok(client);
    } catch (error) {
      return serverError(error);
    }
  }
}
