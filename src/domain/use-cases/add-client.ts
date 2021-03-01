import { Client } from '../protocols';

export interface AddClient {
  add(client: Client): Promise<boolean>;
}
