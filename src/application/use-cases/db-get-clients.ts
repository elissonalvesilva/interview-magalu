import {
  GetClients,
  ClientResponse,
} from './../../domain/use-cases/get-clients';
import { GetClientsRepository } from './../protocols/get-clients-repository';

export class DbGetClients implements GetClients {
  constructor(private getClientRepository: GetClientsRepository) {}

  async getClients(): Promise<ClientResponse[] | null> {
    const clientResponse = await this.getClientRepository.getClients();

    if (!clientResponse) {
      return null;
    }

    return clientResponse;
  }
}
