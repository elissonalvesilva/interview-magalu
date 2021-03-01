import { Client } from 'domain/protocols';

export interface AddClientRepository {
  addClient(client: Client): Promise<boolean>;
}
