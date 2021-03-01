import { Client } from '../protocols';

export interface UpdateClient {
  update(client: Client): Promise<boolean>;
}
