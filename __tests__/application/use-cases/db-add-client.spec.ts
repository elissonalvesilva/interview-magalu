import { DbAddClient } from './../../../src/application/use-cases';
import { AddClientRepository } from 'application/protocols';
import { Client } from 'domain/protocols';
import { CheckClientByEmailRepository } from 'application/protocols/check-client-by-email-repository';

const makeFakeClient = (): Client => ({
  name: 'valid name',
  email: 'mail@mail.com',
});

const makeCheckClientByEmailRepository = (): CheckClientByEmailRepository => {
  class CheckClientByEmailRepositoryStub
    implements CheckClientByEmailRepository {
    checkClientByEmail(email: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }
  return new CheckClientByEmailRepositoryStub();
};

const makeAddClientRepository = (): AddClientRepository => {
  class AddClientRepositoryStub implements AddClientRepository {
    addClient(client: Client): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }
  return new AddClientRepositoryStub();
};

interface SutTypes {
  sut: DbAddClient;
  addClientRepositoryStub: AddClientRepository;
  checkClientByEmailRepositoryStub: CheckClientByEmailRepository;
}

const makeSut = (): SutTypes => {
  const addClientRepositoryStub = makeAddClientRepository();
  const checkClientByEmailRepositoryStub = makeCheckClientByEmailRepository();
  const sut = new DbAddClient(
    addClientRepositoryStub,
    checkClientByEmailRepositoryStub,
  );
  return {
    sut,
    addClientRepositoryStub,
    checkClientByEmailRepositoryStub,
  };
};

describe('DbAddClient UseCase', () => {
  describe('CheckClientByEmailRepository', () => {
    test('should call CheckClientByEmailRepository with correct values', async () => {
      const { sut, checkClientByEmailRepositoryStub } = makeSut();

      const checkClientByEmailRepositorySpy = jest.spyOn(
        checkClientByEmailRepositoryStub,
        'checkClientByEmail',
      );

      await sut.add(makeFakeClient());
      expect(checkClientByEmailRepositorySpy).toBeCalledWith(
        makeFakeClient().email,
      );
    });

    test('should return throw if CheckClientByEmailRepository throws', async () => {
      const { sut, checkClientByEmailRepositoryStub } = makeSut();

      jest
        .spyOn(checkClientByEmailRepositoryStub, 'checkClientByEmail')
        .mockReturnValueOnce(
          new Promise((resolve, reject) => reject(new Error())),
        );

      const promise = sut.add(makeFakeClient());
      await expect(promise).rejects.toThrow();
    });
  });

  describe('AddClientRepository', () => {
    test('should call AddClientRepository with correct values', async () => {
      const {
        sut,
        addClientRepositoryStub,
        checkClientByEmailRepositoryStub,
      } = makeSut();

      jest
        .spyOn(checkClientByEmailRepositoryStub, 'checkClientByEmail')
        .mockReturnValueOnce(new Promise((resolve) => resolve(false)));

      const addClientRepositorySpy = jest.spyOn(
        addClientRepositoryStub,
        'addClient',
      );

      await sut.add(makeFakeClient());
      expect(addClientRepositorySpy).toBeCalledWith(makeFakeClient());
    });

    test('should return throw if AddClientRepository throws', async () => {
      const {
        sut,
        addClientRepositoryStub,
        checkClientByEmailRepositoryStub,
      } = makeSut();

      jest
        .spyOn(checkClientByEmailRepositoryStub, 'checkClientByEmail')
        .mockReturnValueOnce(new Promise((resolve) => resolve(false)));

      jest
        .spyOn(addClientRepositoryStub, 'addClient')
        .mockReturnValueOnce(
          new Promise((resolve, reject) => reject(new Error())),
        );

      const promise = sut.add(makeFakeClient());
      await expect(promise).rejects.toThrow();
    });
  });
});
