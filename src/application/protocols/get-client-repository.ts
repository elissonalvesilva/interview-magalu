import { Client } from './../../domain/protocols/client';

export interface GetClientRepository {
  getClient(id: string): Promise<Partial<Client>>;
}
