import { Client } from 'domain/protocols';

import {
  AddClientRepository,
  CheckClientByEmailRepository,
  CheckClientByIdRepository,
  GetClientRepository,
  UpdateClientRepository,
} from './../../../application/protocols';
import { MongoHelper } from './helpers';

export class ClientMongoRepository
  implements
    AddClientRepository,
    CheckClientByIdRepository,
    CheckClientByEmailRepository,
    GetClientRepository,
    UpdateClientRepository {
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

  async getClient(id: string): Promise<Partial<Client>> {
    const clientCollection = await MongoHelper.getCollection('clients');
    const client = await clientCollection.findOne(
      {
        _id: id,
      },
      {
        projection: {
          _id: 1,
          name: 1,
          email: 1,
        },
      },
    );

    return client && MongoHelper.map(client);
  }

  async updateClient(id: string, client: Client): Promise<boolean> {
    const clientCollection = await MongoHelper.getCollection('clients');
    const updatedClient = await clientCollection.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          name: client.name,
          email: client.email,
        },
      },
    );

    return updatedClient.modifiedCount > 0 ? true : false;
  }
}
