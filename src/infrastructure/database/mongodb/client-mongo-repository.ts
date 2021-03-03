import { Client } from 'domain/protocols';

import {
  AddClientRepository,
  CheckClientByIdRepository,
} from './../../../application/protocols';
import { MongoHelper } from './helpers';

export class ClientMongoRepository
  implements AddClientRepository, CheckClientByIdRepository {
  async addClient(client: Client): Promise<boolean> {
    const clientCollection = await MongoHelper.getCollection('clients');
    const resultResponse = await clientCollection.insertOne(client);
    return resultResponse.ops[0] !== null;
  }

  async checkClientById(id: string): Promise<boolean> {
    const clientCollection = await MongoHelper.getCollection('clients');
    const account = await clientCollection.findOne(
      {
        _id: id,
      },
      {
        projection: {
          _id: 1,
        },
      },
    );
    return account !== null;
  }
}
