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

  describe('LoadByEmail method', () => {
    test('should return account if in database', async () => {
      const fakeAccount = makeFakeAccount();
      const account = await AccountModel.create(fakeAccount);

      const sut = makeSut();
      const accountResponse = await sut.loadByEmail(account.email);
      expect(accountResponse?.email).toBe(account.email);
      expect(accountResponse?.name).toBe(account.name);
    });

    test('should return null if account not in database', async () => {
      await AccountModel.create(makeFakeAccount());

      const sut = makeSut();
      const accountResponse = await sut.loadByEmail('invalid_email@mail.com');
      expect(accountResponse).toBeNull();
    });
  });

  describe('updateAccessToken method', () => {
    test('should update the account accessToken on success', async () => {
      const sut = makeSut();
      const res = await AccountModel.create(makeFakeAccount());
      const fakeAccount = res;
      expect(fakeAccount.accessToken).toBeFalsy();
      const accessToken = faker.random.uuid();
      await sut.updateAccessToken(fakeAccount._id, accessToken);
      const account = await AccountModel.findOne({ _id: fakeAccount._id });
      expect(account).toBeTruthy();
      expect(account?.accessToken).toBe(accessToken);
    });
  });

  describe('loadByToken method', () => {
    let name = faker.name.findName();
    let email = faker.internet.email();
    let password = faker.internet.password();
    let accessToken = faker.random.uuid();

    beforeEach(() => {
      name = faker.name.findName();
      email = faker.internet.email();
      password = faker.internet.password();
      accessToken = faker.random.uuid();
    });

    test('Should return an account on loadByToken', async () => {
      const sut = makeSut();
      await AccountModel.create({
        name,
        email,
        password,
        accessToken,
      });
      const account = await sut.loadByToken(accessToken);
      expect(account).toBeTruthy();
      expect(account?.id).toBeTruthy();
    });

    test('Should return null if loadByToken fails', async () => {
      const sut = makeSut();
      const account = await sut.loadByToken(accessToken);
      expect(account).toBeFalsy();
    });
  });
});
