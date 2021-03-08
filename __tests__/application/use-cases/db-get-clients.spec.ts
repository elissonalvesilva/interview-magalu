import { GetClientsRepository } from './../../../src/application/protocols/get-clients-repository';
import { DbGetClients } from './../../../src/application/use-cases/db-get-clients';
import { ClientResponse } from 'domain/use-cases';

const makeFakeClient = (): ClientResponse => ({
  _id: 'valid_id',
  name: 'valid name',
  email: 'mail@mail.com',
  favorites: ['123', '12345'],
});

const makeGetClientRepository = (): GetClientsRepository => {
  class GetClientRepositoryStub implements GetClientsRepository {
    getClients(): Promise<ClientResponse[] | null> {
      return new Promise((resolve) => resolve(null));
    }
  }
  return new GetClientRepositoryStub();
};

interface SutTypes {
  sut: DbGetClients;
  getClientsRepositoryStub: GetClientsRepository;
}

const makeSut = (): SutTypes => {
  const getClientsRepositoryStub = makeGetClientRepository();
  const sut = new DbGetClients(getClientsRepositoryStub);
  return {
    sut,
    getClientsRepositoryStub,
  };
};

describe('DbGetClients UseCase', () => {
  describe('getClients Method', () => {
    test('should return empty favorits if clients has anyone', async () => {
      const { sut, getClientsRepositoryStub } = makeSut();
      jest
        .spyOn(getClientsRepositoryStub, 'getClients')
        .mockImplementationOnce(() => {
          return new Promise((resolve) => resolve([makeFakeClient()]));
        });

      const response = await sut.getClients();
      expect(response).toEqual([makeFakeClient()]);
    });

    test('should return empty client if clients not found', async () => {
      const { sut, getClientsRepositoryStub } = makeSut();
      jest
        .spyOn(getClientsRepositoryStub, 'getClients')
        .mockImplementationOnce(() => {
          return new Promise((resolve) => resolve(null));
        });

      const response = await sut.getClients();
      expect(response).toBeNull();
    });
  });
});
