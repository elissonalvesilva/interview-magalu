import { DbGetClient } from './../../../src/application/use-cases';
import { GetClientRepository } from 'application/protocols';
import { Client } from 'domain/protocols';

const id = 'valid_id';

const makeFakeClient = (): Client => ({
  id,
  name: 'valid name',
  email: 'mail@mail.com',
});

const makeGetClientRepository = (): GetClientRepository => {
  class GetClientRepositoryStub implements GetClientRepository {
    getClient(id: string): Promise<Partial<Client>> {
      return new Promise((resolve) => resolve(makeFakeClient()));
    }
  }
  return new GetClientRepositoryStub();
};

interface SutTypes {
  sut: DbGetClient;
  getClientRepositoryStub: GetClientRepository;
}

const makeSut = (): SutTypes => {
  const getClientRepositoryStub = makeGetClientRepository();
  const sut = new DbGetClient(getClientRepositoryStub);
  return {
    sut,
    getClientRepositoryStub,
  };
};

describe('DbGetClient UseCase', () => {
  describe('GetClientRepository', () => {
    test('should call GetClientRepository with correct values', async () => {
      const { sut, getClientRepositoryStub } = makeSut();

      const getClientRepositorySpy = jest.spyOn(
        getClientRepositoryStub,
        'getClient',
      );

      await sut.get(id);
      expect(getClientRepositorySpy).toBeCalledWith(id);
    });

    test('should return throw if CheckClientByEmailRepository throws', async () => {
      const { sut, getClientRepositoryStub } = makeSut();

      jest
        .spyOn(getClientRepositoryStub, 'getClient')
        .mockReturnValueOnce(
          new Promise((resolve, reject) => reject(new Error())),
        );

      const promise = sut.get(id);
      await expect(promise).rejects.toThrow();
    });
  });
});
