import { GetClientRepository } from './../protocols/get-client-repository';
import { Client } from 'domain/protocols';
import { GetClient } from './../../domain/use-cases';

export class DbGetClient implements GetClient {
  constructor(private getClientRepository: GetClientRepository) {}

  async get(id: string): Promise<Partial<Client>> {
    const client = await this.getClientRepository.getClient(id);
    return client;
  }
}
