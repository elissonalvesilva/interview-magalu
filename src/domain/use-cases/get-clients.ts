import { ClientResult } from 'domain/protocols';

export interface ClientsList {
  clients: ClientResult[];
}

export interface GetClients {
  getClients(): Promise<Partial<ClientsList>>;
}
