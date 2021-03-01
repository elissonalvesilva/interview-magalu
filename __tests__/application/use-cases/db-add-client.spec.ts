import { DbAddClient } from './../../../src/application/use-cases';
import { AddClientRepository } from 'application/protocols';
import { Client } from 'domain/protocols';

const makeFakeClient = (): Client => ({
  id: 'valid_id',
  name: 'valid name',
  email: 'mail@mail.com',
});

const makeAddClientRepository = (): AddClientRepository => {
  class AddClientRepositoryStub implements AddClientRepository {
    addClient(client: Client): Promise<Client> {
      return new Promise((resolve) => resolve(makeFakeClient()));
    }
  }
  return new AddClientRepositoryStub();
};

interface SutTypes {
  sut: DbAddClient;
  addClientRepositoryStub: AddClientRepository;
}

const makeSut = (): SutTypes => {
  const addClientRepositoryStub = makeAddClientRepository();
  const sut = new DbAddClient(addClientRepositoryStub);
  return {
    sut,
    addClientRepositoryStub,
  };
};

describe('DbAddClient UseCase', () => {
  test('should call AddClientRepository with correct values', async () => {
    const { sut, addClientRepositoryStub } = makeSut();
    const addClientRepositorySpy = jest.spyOn(
      addClientRepositoryStub,
      'addClient',
    );

    await sut.add(makeFakeClient());
    expect(addClientRepositorySpy).toBeCalledWith(makeFakeClient());
  });

  test('should return throw if AddClientRepository throws', async () => {
    const { sut, addClientRepositoryStub } = makeSut();
    jest
      .spyOn(addClientRepositoryStub, 'addClient')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const promise = sut.add(makeFakeClient());
    await expect(promise).rejects.toThrow();
  });
});
