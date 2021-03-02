import {
  CheckClientByIdRepository,
  DeleteClientRepository,
} from './../protocols';
import { DeleteClient } from './../../domain/use-cases';

export class DbDeleteClient implements DeleteClient {
  constructor(
    private deleteClientRepository: DeleteClientRepository,
    private checkClientByIdRepository: CheckClientByIdRepository,
  ) {}

  async delete(id: string): Promise<boolean> {
    let deletedClient = false;

    const existsClient = await this.checkClientByIdRepository.checkClientById(
      id,
    );

    if (existsClient) {
      deletedClient = await this.deleteClientRepository.deleteClient(id);
    }

    return deletedClient;
  }
}
