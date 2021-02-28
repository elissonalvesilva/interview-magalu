import { Client } from '../protocols/client';

export interface AddClient {
  add(client: Client): Promise<boolean>;
}
