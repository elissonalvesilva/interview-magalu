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

  describe('Check Client By Email method', async () => {
    test('Should return true if email is valid', async () => {
      const sut = makeSut();
      const addClientParams = makeAddClient();
      await clientCollection.insertOne(addClientParams);
      const existsClient = await sut.checkClientByEmail(addClientParams.email);
      expect(existsClient).toBe(true);
    });

    test('Should return false if email is not valid', async () => {
      const sut = makeSut();
      const existsClient = await sut.checkClientByEmail(faker.internet.email());
      expect(existsClient).toBe(false);
    });
  });

  describe('Get Client method', async () => {
    test('Should return a client if id is valid', async () => {
      const sut = makeSut();
      const addClientParams = makeAddClient();
      const client = await clientCollection.insertOne(addClientParams);
      const createdClient = await sut.getClient(client.ops[0]._id);
      expect(createdClient).toBeTruthy();
      expect(createdClient.id).toBeTruthy();
      expect(createdClient.name).toBe(addClientParams.name);
      expect(createdClient.email).toBe(addClientParams.email);
    });

    test('Should return a null if id is not valid', async () => {
      const sut = makeSut();
      const addClientParams = makeAddClient();
      await clientCollection.insertOne(addClientParams);
      const createdClient = await sut.getClient('not valid id');
      expect(createdClient).toBeFalsy();
    });
  });

  describe('Update Client method', async () => {
    test('Should return true if client is updated', async () => {
      const sut = makeSut();
      const addClientParams = makeAddClient();
      const createdClient = await clientCollection.insertOne(addClientParams);
      const fakeClient = createdClient.ops[0];
      const updatedClientParams: Client = {
        name: 'valid name 2',
        email: 'mail@mail.com',
      };
      const response = await sut.updateClient(
        fakeClient._id,
        updatedClientParams,
      );
      expect(response).toBe(true);
      const client = await clientCollection.findOne({ _id: fakeClient._id });
      expect(client).toBeTruthy();
      expect(client.name).toBe(updatedClientParams.name);
    });

    test('Should return false if client is not updated and id is invalid', async () => {
      const sut = makeSut();
      const addClientParams = makeAddClient();
      const createdClient = await clientCollection.insertOne(addClientParams);
      const fakeClient = createdClient.ops[0];
      const updatedClientParams: Client = {
        name: 'valid name 2',
        email: 'mail@mail.com',
      };
      const response = await sut.updateClient('fake_id', updatedClientParams);
      expect(response).toBe(false);
      const client = await clientCollection.findOne({ _id: fakeClient._id });
      expect(client).toBeTruthy();
      expect(client.name).toBe(addClientParams.name);
    });
  });
});
