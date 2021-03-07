import { ClientResult } from '../protocols';

export interface GetClient {
  get(id: string): Promise<Partial<ClientResult>>;
}
