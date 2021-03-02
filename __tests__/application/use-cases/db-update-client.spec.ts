import { DbUpdateClient } from './../../../src/application/use-cases';
import { UpdateClientRepository } from 'application/protocols';
import { Client } from 'domain/protocols';
import { CheckClientByIdRepository } from 'application/protocols';

const fakeId = 'valid_id';

const makeFakeClient = (): Client => ({
  id: fakeId,
  name: 'valid name',
  email: 'mail@mail.com',
});

const makeCheckClientByIdRepository = (): CheckClientByIdRepository => {
  class CheckClientByIdRepositoryStub implements CheckClientByIdRepository {
    checkClientById(id: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }
  return new CheckClientByIdRepositoryStub();
};

const makeUpdateClientRepository = (): UpdateClientRepository => {
  class UpdateClientRepositoryStub implements UpdateClientRepository {
    updateClient(id: string, client: Client): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }
  return new UpdateClientRepositoryStub();
};

interface SutTypes {
  sut: DbUpdateClient;
  updateClientRepositoryStub: UpdateClientRepository;
  checkClientByIdRepositoryStub: CheckClientByIdRepository;
}

const makeSut = (): SutTypes => {
  const updateClientRepositoryStub = makeUpdateClientRepository();
  const checkClientByIdRepositoryStub = makeCheckClientByIdRepository();
  const sut = new DbUpdateClient(
    updateClientRepositoryStub,
    checkClientByIdRepositoryStub,
  );
  return {
    sut,
    updateClientRepositoryStub,
    checkClientByIdRepositoryStub,
  };
};

describe('DbUpdateClient UseCase', () => {
  describe('CheckClientByIdRepository', () => {
    test('should call CheckClientByIdRepository with correct values', async () => {
      const { sut, checkClientByIdRepositoryStub } = makeSut();

      const checkClientByIdRepositorySpy = jest.spyOn(
        checkClientByIdRepositoryStub,
        'checkClientById',
      );

      await sut.update(fakeId, makeFakeClient());
      expect(checkClientByIdRepositorySpy).toBeCalledWith(makeFakeClient().id);
    });

    test('should return throw if CheckClientByIdRepository throws', async () => {
      const { sut, checkClientByIdRepositoryStub } = makeSut();

      jest
        .spyOn(checkClientByIdRepositoryStub, 'checkClientById')
        .mockReturnValueOnce(
          new Promise((resolve, reject) => reject(new Error())),
        );

      const promise = sut.update(fakeId, makeFakeClient());
      await expect(promise).rejects.toThrow();
    });
  });

  describe('UpdateClientRepository', () => {
    test('should call UpdateClientRepository with correct values', async () => {
      const {
        sut,
        updateClientRepositoryStub,
        checkClientByIdRepositoryStub,
      } = makeSut();

      jest
        .spyOn(checkClientByIdRepositoryStub, 'checkClientById')
        .mockReturnValueOnce(new Promise((resolve) => resolve(false)));

      const UpdateClientRepositorySpy = jest.spyOn(
        updateClientRepositoryStub,
        'updateClient',
      );

      await sut.update(fakeId, makeFakeClient());
      expect(UpdateClientRepositorySpy).toBeCalledWith(
        fakeId,
        makeFakeClient(),
      );
    });

    test('should return throw if UpdateClientRepository throws', async () => {
      const {
        sut,
        updateClientRepositoryStub,
        checkClientByIdRepositoryStub,
      } = makeSut();

      jest
        .spyOn(checkClientByIdRepositoryStub, 'checkClientById')
        .mockReturnValueOnce(new Promise((resolve) => resolve(false)));

      jest
        .spyOn(updateClientRepositoryStub, 'updateClient')
        .mockReturnValueOnce(
          new Promise((resolve, reject) => reject(new Error())),
        );

      const promise = sut.update(fakeId, makeFakeClient());
      await expect(promise).rejects.toThrow();
    });
  });
});
