import { Client } from 'domain/protocols';

import { AddClientRepository } from './../../../application/protocols/add-client-repository';
import { MongoHelper } from './helpers';

export class ClientMongoRepository implements AddClientRepository {
  async addClient(client: Client): Promise<boolean> {
    const clientCollection = await MongoHelper.getCollection('clients');
    const resultResponse = await clientCollection.insertOne(client);
    return resultResponse.ops[0] !== null;
  }
}
