import { Client } from 'domain/protocols';

export interface UpdateClientRepository {
  updateClient(client: Client): Promise<boolean>;
}
