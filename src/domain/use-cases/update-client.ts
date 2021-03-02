import { Client } from '../protocols';

export interface UpdateClient {
  update(id: string, client: Client): Promise<boolean>;
}
