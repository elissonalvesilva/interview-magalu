import { CheckAccountByEmailRepository } from './../../../src/application/protocols/account/check-account-by-email-repository';
import { AddAccountRepository } from './../../../src/application/protocols/account/add-account-repository';
import { CriptograpyHasher } from './../../../src/application/protocols/criptography/criptography-hasher';
import { DbAddAccount } from './../../../src/application/use-cases/db-add-account';

import faker from 'faker';
import { Account } from './../../../src/domain/protocols';

const makeFakeRequest = (): any => {
  const password = faker.internet.password();
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
    passwordConfirmation: password,
  };
};

const makeCheckAccountByEmailRepository = (): CheckAccountByEmailRepository => {
  class CheckAccountByEmailRepositoryStub
    implements CheckAccountByEmailRepository {
    checkAccountByEmail(email: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }
  return new CheckAccountByEmailRepositoryStub();
};

const makeHasher = (): CriptograpyHasher => {
  class CriptograpyHasherStub implements CriptograpyHasher {
    hash(plaintext: string): Promise<string> {
      return new Promise((resolve) => resolve(faker.internet.password()));
    }
  }
  return new CriptograpyHasherStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    add(account: Account): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }
  return new AddAccountRepositoryStub();
};

type SutTypes = {
  sut: DbAddAccount;
  hasherStub: CriptograpyHasher;
  addAccountRepositoryStub: AddAccountRepository;
  checkAccountByEmailRepositoryStub: CheckAccountByEmailRepository;
};

const makeSut = (): SutTypes => {
  const checkAccountByEmailRepositoryStub = makeCheckAccountByEmailRepository();
  const hasherStub = makeHasher();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(
    hasherStub,
    addAccountRepositoryStub,
    checkAccountByEmailRepositoryStub,
  );
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    checkAccountByEmailRepositoryStub,
  };
};

describe('DbAddAccount Usecase', () => {
  describe('CheckAccountByEmailRepository', () => {
    test('should call CheckAccountByEmailRepository with correct values', async () => {
      const { sut, checkAccountByEmailRepositoryStub } = makeSut();
      const addAccountParams = makeFakeRequest();

      const checkAccountByEmailRepositorySpy = jest.spyOn(
        checkAccountByEmailRepositoryStub,
        'checkAccountByEmail',
      );

      await sut.add(addAccountParams);
      expect(checkAccountByEmailRepositorySpy).toBeCalledWith(
        addAccountParams.email,
      );
    });

    test('should return throw if CheckAccountByEmailRepository throws', async () => {
      const { sut, checkAccountByEmailRepositoryStub } = makeSut();

      jest
        .spyOn(checkAccountByEmailRepositoryStub, 'checkAccountByEmail')
        .mockReturnValueOnce(
          new Promise((resolve, reject) => reject(new Error())),
        );

      const promise = sut.add(makeFakeRequest());
      await expect(promise).rejects.toThrow();
    });
  });

  describe('CriptograpyHasher', () => {
    test('should call CriptograpyHasher with correct values', async () => {
      const { sut, checkAccountByEmailRepositoryStub, hasherStub } = makeSut();
      const addAccountParams = makeFakeRequest();

      jest
        .spyOn(checkAccountByEmailRepositoryStub, 'checkAccountByEmail')
        .mockReturnValueOnce(new Promise((resolve) => resolve(false)));

      const hasherSpy = jest.spyOn(hasherStub, 'hash');

      await sut.add(addAccountParams);
      expect(hasherSpy).toBeCalledWith(addAccountParams.password);
    });

    test('should return throw if CriptograpyHasher throws', async () => {
      const { sut, hasherStub, checkAccountByEmailRepositoryStub } = makeSut();

      jest
        .spyOn(checkAccountByEmailRepositoryStub, 'checkAccountByEmail')
        .mockReturnValueOnce(new Promise((resolve) => resolve(false)));

      jest
        .spyOn(hasherStub, 'hash')
        .mockReturnValueOnce(
          new Promise((resolve, reject) => reject(new Error())),
        );

      const promise = sut.add(makeFakeRequest());
      await expect(promise).rejects.toThrow();
    });
  });

  describe('AddAccountRepository', () => {
    test('should call AddAccountRepository with correct values', async () => {
      const {
        sut,
        hasherStub,
        checkAccountByEmailRepositoryStub,
        addAccountRepositoryStub,
      } = makeSut();
      const addAccountParams = makeFakeRequest();

      jest
        .spyOn(checkAccountByEmailRepositoryStub, 'checkAccountByEmail')
        .mockReturnValueOnce(new Promise((resolve) => resolve(false)));

      jest
        .spyOn(hasherStub, 'hash')
        .mockReturnValueOnce(
          new Promise((resolve) => resolve(addAccountParams.password)),
        );

      const addAccountSpy = jest.spyOn(addAccountRepositoryStub, 'add');

      await sut.add(addAccountParams);
      expect(addAccountSpy).toBeCalledWith(addAccountParams);
    });

    test('should return throw if AddAccountRepository throws', async () => {
      const {
        sut,
        hasherStub,
        checkAccountByEmailRepositoryStub,
        addAccountRepositoryStub,
      } = makeSut();

      jest
        .spyOn(checkAccountByEmailRepositoryStub, 'checkAccountByEmail')
        .mockReturnValueOnce(new Promise((resolve) => resolve(false)));

      jest
        .spyOn(hasherStub, 'hash')
        .mockReturnValueOnce(
          new Promise((resolve) => resolve(makeFakeRequest().password)),
        );

      jest
        .spyOn(addAccountRepositoryStub, 'add')
        .mockReturnValueOnce(
          new Promise((resolve, reject) => reject(new Error())),
        );

      const promise = sut.add(makeFakeRequest());
      await expect(promise).rejects.toThrow();
    });
  });
});
