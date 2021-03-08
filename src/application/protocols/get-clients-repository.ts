import { ClientResponse } from './../../domain/use-cases/get-clients';

export interface GetClientsRepository {
  getClients(): Promise<ClientResponse[] | null>;
}
