import { DeleteClientRepository } from './../../../src/application/protocols/delete-client-repository';
import { CheckClientByIdRepository } from './../../../src/application/protocols/check-client-by-id-repository';
import { DbDeleteClient } from './../../../src/application/use-cases';
import { GetClientRepository } from 'application/protocols';

const id = 'valid_id';

const makeCheckClientByIdRepository = (): CheckClientByIdRepository => {
  class CheckClientByIdRepositoryStub implements CheckClientByIdRepository {
    checkClientById(id: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }
  return new CheckClientByIdRepositoryStub();
};

const makeDeleteClientRepository = (): DeleteClientRepository => {
  class DeleteClientRepositoryStub implements DeleteClientRepository {
    deleteClient(id: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }
  return new DeleteClientRepositoryStub();
};

interface SutTypes {
  sut: DbDeleteClient;
  deleteClientRepositoryStub: DeleteClientRepository;
  checkClientByIdRepositoryStub: CheckClientByIdRepository;
}

const makeSut = (): SutTypes => {
  const deleteClientRepositoryStub = makeDeleteClientRepository();
  const checkClientByIdRepositoryStub = makeCheckClientByIdRepository();
  const sut = new DbDeleteClient(
    deleteClientRepositoryStub,
    checkClientByIdRepositoryStub,
  );
  return {
    sut,
    deleteClientRepositoryStub,
    checkClientByIdRepositoryStub,
  };
};

describe.only('DbDeleteClient UseCase', () => {
  describe('CheckClientByIdRepositorySpy', () => {
    test('should call DeleteClientRepository with correct values', async () => {
      const { sut, checkClientByIdRepositoryStub } = makeSut();

      const checkClientByIdRepositorySpy = jest.spyOn(
        checkClientByIdRepositoryStub,
        'checkClientById',
      );

      await sut.delete(id);
      expect(checkClientByIdRepositorySpy).toBeCalledWith(id);
    });

    test('should call DeleteClientRepository with correct values and return false if not exists client', async () => {
      const { sut, checkClientByIdRepositoryStub } = makeSut();

      const checkClientByIdRepositorySpy = jest.spyOn(
        checkClientByIdRepositoryStub,
        'checkClientById',
      );

      checkClientByIdRepositorySpy.mockReturnValueOnce(
        new Promise((resolve) => resolve(false)),
      );

      await sut.delete(id);
      expect(checkClientByIdRepositorySpy).toBeCalledWith(id);
    });

    test('should return throw if CheckClientByIdRepositorySpy throws', async () => {
      const { sut, checkClientByIdRepositoryStub } = makeSut();

      jest
        .spyOn(checkClientByIdRepositoryStub, 'checkClientById')
        .mockReturnValueOnce(
          new Promise((resolve, reject) => reject(new Error())),
        );

      const promise = sut.delete(id);
      await expect(promise).rejects.toThrow();
    });
  });
  describe('DeleteClientRepository', () => {
    test('should call DeleteClientRepository with correct values', async () => {
      const {
        sut,
        deleteClientRepositoryStub,
        checkClientByIdRepositoryStub,
      } = makeSut();

      jest
        .spyOn(checkClientByIdRepositoryStub, 'checkClientById')
        .mockReturnValueOnce(new Promise((resolve) => resolve(true)));

      const deleteClientRepositorySpy = jest.spyOn(
        deleteClientRepositoryStub,
        'deleteClient',
      );

      await sut.delete(id);
      expect(deleteClientRepositorySpy).toBeCalledWith(id);
    });

    test('should return throw if DeleteClientRepository throws', async () => {
      const {
        sut,
        deleteClientRepositoryStub,
        checkClientByIdRepositoryStub,
      } = makeSut();

      jest
        .spyOn(checkClientByIdRepositoryStub, 'checkClientById')
        .mockReturnValueOnce(new Promise((resolve) => resolve(true)));

      jest
        .spyOn(deleteClientRepositoryStub, 'deleteClient')
        .mockReturnValueOnce(
          new Promise((resolve, reject) => reject(new Error())),
        );

      const promise = sut.delete(id);
      await expect(promise).rejects.toThrow();
    });
  });
});
