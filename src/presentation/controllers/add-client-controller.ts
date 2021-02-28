import { Controller, HttpResponse } from '../protocols';

export class AddClientControler implements Controller {
  handle(request: any): Promise<HttpResponse> {
    throw new Error('Method not implemented.');
  }
}
