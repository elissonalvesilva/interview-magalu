import { Client } from './../../domain/protocols';

export interface ClientResponse extends Client {
  _id: string;
}

export interface GetClients {
  getClients(): Promise<ClientResponse[] | null>;
}
