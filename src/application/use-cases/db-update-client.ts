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

  async update(client: Client): Promise<boolean> {
    let updateCreateUser = false;

    if (!client.id) {
      return updateCreateUser;
    }

    const emailIsAlreadyInUse = await this.checkClientByIdRepository.checkClientById(
      client.id,
    );

    if (!emailIsAlreadyInUse) {
      updateCreateUser = await this.updateClientRepository.updateClient(client);
    }

    return updateCreateUser;
  }
}
