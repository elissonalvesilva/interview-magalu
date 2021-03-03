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

let accountCollection: Collection;

describe('ClientMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL || '');
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('clients');
    await accountCollection.deleteMany({});
  });
  describe('Add Client method', async () => {
    test('Should return an client on success', async () => {
      const sut = makeSut();
      const addClient = makeAddClient();
      const isValid = await sut.addClient(addClient);
      expect(isValid).toBe(true);
    });
  });
});
