import { Client } from 'domain/protocols';

export interface UpdateClientRepository {
  updateClient(id: string, client: Client): Promise<boolean>;
}
