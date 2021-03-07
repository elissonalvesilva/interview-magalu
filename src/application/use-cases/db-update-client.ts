import {
  CheckClientByIdRepository,
  UpdateClientRepository,
} from './../protocols';
import { Client } from './../../domain/protocols';
import { UpdateClient } from './../../domain/use-cases';

export class DbUpdateClient implements UpdateClient {
  constructor(
    private updateClientRepository: UpdateClientRepository,
    private checkClientByIdRepository: CheckClientByIdRepository,
  ) {}

  async update(id: string, client: Client): Promise<boolean> {
    let updateCreateUser = false;

    const existClient = await this.checkClientByIdRepository.checkClientById(
      id,
    );

    if (existClient) {
      updateCreateUser = await this.updateClientRepository.updateClient(
        id,
        client,
      );
    }

    return updateCreateUser;
  }
}
