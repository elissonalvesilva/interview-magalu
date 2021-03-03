import { Client } from 'domain/protocols';

import {
  AddClientRepository,
  CheckClientByEmailRepository,
  CheckClientByIdRepository,
} from './../../../application/protocols';
import { MongoHelper } from './helpers';

export class ClientMongoRepository
  implements
    AddClientRepository,
    CheckClientByIdRepository,
    CheckClientByEmailRepository {
  async addClient(client: Client): Promise<boolean> {
    const clientCollection = await MongoHelper.getCollection('clients');
    const resultResponse = await clientCollection.insertOne(client);
    return resultResponse.ops[0] !== null;
  }

  async checkClientById(id: string): Promise<boolean> {
    const clientCollection = await MongoHelper.getCollection('clients');
    const client = await clientCollection.findOne(
      {
        _id: id,
      },
      {
        projection: {
          _id: 1,
        },
      },
    );
    return client !== null;
  }

  async checkClientByEmail(email: string): Promise<boolean> {
    const clientCollection = await MongoHelper.getCollection('clients');
    const client = await clientCollection.findOne(
      {
        email,
      },
      {
        projection: {
          _id: 1,
        },
      },
    );

    return client !== null;
  }
}
