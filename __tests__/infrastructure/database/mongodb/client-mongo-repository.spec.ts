import { Collection } from 'mongodb';
import faker from 'faker';

import { MongoHelper } from './../../../../src/infrastructure/database/mongodb/helpers/mongo-helper';
import { ClientMongoRepository } from './../../../../src/infrastructure/database/mongodb/client-mongo-repository';
import { Client } from './../../../../src/domain/protocols';

const makeAddClient = (): Client => {
  return {
    name: 'valid name',
    email: 'mail@mail.com',
  };
};

const makeSut = (): ClientMongoRepository => {
  return new ClientMongoRepository();
};

let clientCollection: Collection;

describe('ClientMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL || '');
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    clientCollection = await MongoHelper.getCollection('clients');
    await clientCollection.deleteMany({});
  });
  describe('Add Client method', async () => {
    test('Should return a client on success', async () => {
      const sut = makeSut();
      const addClient = makeAddClient();
      const isValid = await sut.addClient(addClient);
      expect(isValid).toBe(true);
    });
  });

  describe('Check Client By Id method', async () => {
    test('Should return true if id is valid', async () => {
      const sut = makeSut();
      const addClientParams = makeAddClient();
      const client = await clientCollection.insertOne(addClientParams);
      const existsClient = await sut.checkClientById(client.ops[0]._id);
      expect(existsClient).toBe(true);
    });

    test('Should return false if id is not valid', async () => {
      const sut = makeSut();
      const existsClient = await sut.checkClientById('123');
      expect(existsClient).toBe(false);
    });
  });
});
