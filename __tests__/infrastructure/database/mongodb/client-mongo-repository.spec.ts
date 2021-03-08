import faker from 'faker';

import { MongoHelper } from './../../../../src/infrastructure/database/mongodb/helpers/mongoose-helper';
import { ClientMongoRepository } from './../../../../src/infrastructure/database/mongodb/client-mongo-repository';
import { Client } from './../../../../src/domain/protocols';
import ClientModel from './../../../../src/infrastructure/database/mongodb/models/Clients';

const makeFakeProductId = (): any => {
  return { id: '604198f3d1f52339643d2367' };
};

const makeAddClient = (): Client => {
  return {
    name: 'valid name',
    email: 'mail@mail.com',
  };
};

const makeSut = (): ClientMongoRepository => {
  return new ClientMongoRepository();
};

describe('ClientMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL || '');
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    await ClientModel.deleteMany({});
  });

  describe('Add Client method', async () => {
    test('Should return a client on success', async () => {
      const sut = makeSut();
      const addClient = makeAddClient();
      const isValid = await sut.addClient(addClient);
      expect(isValid).toBe(true);
    });
  });

  describe('Check Client By Id method', async () => {
    test('Should return true if id is valid', async () => {
      const sut = makeSut();
      const addClientParams = makeAddClient();
      const client = await ClientModel.create(addClientParams);
      const existsClient = await sut.checkClientById(client._id);
      expect(existsClient).toBe(true);
    });

    test('Should return false if id is not valid', async () => {
      const sut = makeSut();
      const existsClient = await sut.checkClientById(
        '604198f3d1f52339643d2367',
      );
      expect(existsClient).toBe(false);
    });
  });

  describe('Check Client By Email method', async () => {
    test('Should return true if email is valid', async () => {
      const sut = makeSut();
      const addClientParams = makeAddClient();
      await ClientModel.create(addClientParams);
      const existsClient = await sut.checkClientByEmail(addClientParams.email);
      expect(existsClient).toBe(true);
    });

    test('Should return false if email is not valid', async () => {
      const sut = makeSut();
      const existsClient = await sut.checkClientByEmail(faker.internet.email());
      expect(existsClient).toBe(false);
    });
  });

  describe('Get Client method', async () => {
    test('Should return a client if id is valid', async () => {
      const sut = makeSut();
      const addClientParams = makeAddClient();
      const client = await ClientModel.create(addClientParams);
      const createdClient = await sut.getClient(client._id);
      expect(createdClient).toBeTruthy();
      expect(createdClient.name).toBe(addClientParams.name);
      expect(createdClient.email).toBe(addClientParams.email);
    });

    test('Should return a null if id is not valid', async () => {
      const sut = makeSut();
      const addClientParams = makeAddClient();
      await ClientModel.create(addClientParams);
      const createdClient = await sut.getClient('not valid id');
      expect(createdClient).toBeFalsy();
    });
  });

  describe('Update Client method', async () => {
    test('Should return true if client is updated', async () => {
      const sut = makeSut();
      const addClientParams = makeAddClient();
      const createdClient = await ClientModel.create(addClientParams);
      const fakeClient = createdClient;
      const updatedClientParams: Client = {
        name: 'valid name 2',
        email: 'mail@mail.com',
      };
      const response = await sut.updateClient(
        fakeClient._id,
        updatedClientParams,
      );
      expect(response).toBe(true);
      const client = await ClientModel.findOne({ _id: fakeClient._id });
      expect(client).toBeTruthy();
      expect(client?.name).toBe(updatedClientParams.name);
    });

    test('Should return false if client is not updated and id is invalid', async () => {
      const sut = makeSut();
      const addClientParams = makeAddClient();
      const createdClient = await ClientModel.create(addClientParams);
      const fakeClient = createdClient;
      const updatedClientParams: Client = {
        name: 'valid name 2',
        email: 'mail@mail.com',
      };
      const response = await sut.updateClient(
        makeFakeProductId().id,
        updatedClientParams,
      );

      expect(response).toBe(false);
      const client = await ClientModel.findOne({ _id: fakeClient._id });
      expect(client).toBeTruthy();
      expect(client?.name).toBe(addClientParams.name);
    });
  });

  describe('Delete Client method', async () => {
    test('Should return true if client is updated', async () => {
      const sut = makeSut();
      const addClientParams = makeAddClient();
      const createdClient = await ClientModel.create(addClientParams);
      const fakeClient = createdClient;
      const response = await sut.deleteClient(fakeClient._id);
      expect(response).toBe(true);
      const client = await ClientModel.findOne({ _id: fakeClient._id });
      expect(client).toBeFalsy();
      expect(client).toBeNull();
    });

    test('Should return false if client is not delete and id is invalid', async () => {
      const sut = makeSut();
      const addClientParams = makeAddClient();
      const createdClient = await ClientModel.create(addClientParams);
      const fakeClient = createdClient;
      const response = await sut.deleteClient('604198f3d1f52339643d2367');
      expect(response).toBe(false);
      const client = await ClientModel.findOne({ _id: fakeClient._id });
      expect(client).toBeTruthy();
      expect(client?.name).toBe(addClientParams.name);
    });
  });

  describe('Add Favorit method', async () => {
    test('Should return true if product is added', async () => {
      const sut = makeSut();
      const addClientParams = makeAddClient();
      const createdClient = await ClientModel.create(addClientParams);
      const fakeClient = createdClient;
      const fakeProductId = makeFakeProductId().id;
      const response = await sut.addFavorit(fakeClient._id, fakeProductId);
      expect(response).toBe(true);
      const client = await ClientModel.findOne({ _id: fakeClient._id });
      expect(client).toBeTruthy();
      expect(client?.favorites).toContainEqual(fakeProductId);
    });

    test('Should return false if product is not added', async () => {
      const sut = makeSut();
      const addClientParams = makeAddClient();
      const createdClient = await ClientModel.create(addClientParams);
      const fakeClient = createdClient;
      const updatedClientParams: Client = {
        name: 'valid name 2',
        email: 'mail@mail.com',
      };
      const response = await sut.updateClient(
        '604198f3d1f52339643d2367',
        updatedClientParams,
      );
      expect(response).toBe(false);
      const client = await ClientModel.findOne({ _id: fakeClient._id });

      expect(client).toBeTruthy();
      expect(client?.favorites?.length).toBe(0);
    });
  });

  describe('Check Product method', async () => {
    test('Should return true if product is already in favorit list', async () => {
      const sut = makeSut();
      const addClientParams = makeAddClient();
      addClientParams.favorites = [makeFakeProductId().id];
      const createdClient = await ClientModel.create(addClientParams);

      const fakeClient = createdClient;
      const fakeProductId = makeFakeProductId().id;

      const response = await sut.checkProduct(fakeClient._id, fakeProductId);
      expect(response).toBeTruthy();
    });

    test('Should return false if product is not in favorit list', async () => {
      const sut = makeSut();
      const addClientParams = makeAddClient();
      addClientParams.favorites = [makeFakeProductId().id];
      const createdClient = await ClientModel.create(addClientParams);

      const fakeClient = createdClient;

      const response = await sut.checkProduct(fakeClient._id, 'teste');
      expect(response).toBeFalsy();
    });

    test('Should return false if client not found', async () => {
      const sut = makeSut();
      const addClientParams = makeAddClient();
      await ClientModel.create(addClientParams);

      const fakeProductId = makeFakeProductId().id;

      const response = await sut.checkProduct('not_valid_id', fakeProductId);
      expect(response).toBeFalsy();
    });
  });

  describe('GetClients method', async () => {
    test('Should return clients', async () => {
      const sut = makeSut();
      const addClientParams = makeAddClient();
      await ClientModel.create(addClientParams);
      const clients = await sut.getClients();
      if (clients) {
        expect(clients[0].email).toBe(addClientParams.email);
        expect(clients[0].name).toBe(addClientParams.name);
      }
    });

    test('Should return null if not has clients', async () => {
      const sut = makeSut();
      const clients = await sut.getClients();
      expect(clients).toMatchObject([]);
    });
  });
});
