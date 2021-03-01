import { AddClientRepository } from 'application/protocols';
import { CheckClientByEmailRepository } from 'application/protocols/check-client-by-email-repository';
import { Client } from 'domain/protocols';
import { AddClient } from 'domain/use-cases';

export class DbAddClient implements AddClient {
  constructor(
    private addClientRepository: AddClientRepository,
    private checkClientByEmailRepository: CheckClientByEmailRepository,
  ) {}

  async add(client: Client): Promise<boolean> {
    let canCreateUser = false;

    const emailIsAlreadyInUse = await this.checkClientByEmailRepository.checkClientByEmail(
      client.email,
    );
    console.log(emailIsAlreadyInUse);
    if (!emailIsAlreadyInUse) {
      canCreateUser = await this.addClientRepository.addClient(client);
    }

    return canCreateUser;
  }
}
