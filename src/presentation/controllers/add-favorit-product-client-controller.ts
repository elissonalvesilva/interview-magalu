import { AddFavoritProductClient } from './../../domain/use-cases/add-favorit-product-client';
import { MissingParamError, BadRequestError } from './../../presentation/erros';
import { badRequest, ok, serverError } from './../../presentation/helpers';
import { HttpResponse } from './../../presentation/protocols';
import { Controller } from './../protocols/controller';

export class AddFavoritProductClientController implements Controller {
  constructor(private addFavoritProductClient: AddFavoritProductClient) {}

  async handle(request: any): Promise<HttpResponse> {
    try {
      const requiredFields = ['clientid', 'productid'];

      for (const field of requiredFields) {
        if (!request[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const client = await this.addFavoritProductClient.add(
        request.clientid,
        request.productid,
      );

      if (!client.added) {
        if (client.stack) {
          return badRequest(new BadRequestError(client.stack));
        }
        return badRequest(new BadRequestError());
      }

      return ok(client);
    } catch (error) {
      return serverError(error);
    }
  }
}
