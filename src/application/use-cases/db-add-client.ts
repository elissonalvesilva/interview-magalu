import { AddClientRepository } from 'application/protocols';
import { Client } from 'domain/protocols';
import { AddClient } from 'domain/use-cases';

export class DbAddClient implements AddClient {
  constructor(private addClientRepository: AddClientRepository) {}

  async add(client: Client): Promise<boolean> {
    const clientResponse = await this.addClientRepository.addClient(client);

    if (!('id' in clientResponse)) {
      return true;
    }

    return false;
  }
}
