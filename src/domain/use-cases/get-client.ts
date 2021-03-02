import { Client } from '../protocols';

export interface GetClient {
  get(id: string): Promise<Partial<Client>>;
}
