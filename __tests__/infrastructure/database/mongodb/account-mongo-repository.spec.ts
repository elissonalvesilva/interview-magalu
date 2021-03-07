import faker from 'faker';

import { MongoHelper } from './../../../../src/infrastructure/database/mongodb/helpers/mongoose-helper';
import { AccountMongoRepository } from './../../../../src/infrastructure/database/mongodb/account-mongo-repository';
import AccountModel from './../../../../src/infrastructure/database/mongodb/models/Account';

const makeFakeAccount = (): any => {
  const password = faker.internet.password();
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
  };
};

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository();
};

describe('AccountMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL || '');
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    await AccountModel.deleteMany({});
  });
  describe('add method', () => {
    test('should return true if created account', async () => {
      const sut = makeSut();
      const fakeAccount = makeFakeAccount();
      const isValid = await sut.add(fakeAccount);
      expect(isValid).toBe(true);
    });
  });

  describe('CheckAccountByEmail method', () => {
    test('should return true if email already in database', async () => {
      const account = await AccountModel.create(makeFakeAccount());

      const sut = makeSut();
      const isValid = await sut.checkAccountByEmail(account.email);
      expect(isValid).toBe(true);
    });

    test('should return false if email not in database', async () => {
      await AccountModel.create(makeFakeAccount());

      const sut = makeSut();
      const isValid = await sut.checkAccountByEmail('invalid_email@mail.com');
      expect(isValid).toBe(false);
    });
  });
});
