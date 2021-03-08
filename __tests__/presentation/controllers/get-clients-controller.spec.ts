import { ClientsList, GetClients } from './../../domain/use-cases';
import { ServerError } from '../../../src/presentation/erros';
import {
  ok,
  serverError,
} from '../../../src/presentation/helpers/http-helpers';
import { GetClientsController } from './../../../src/presentation/controllers/get-clients-controller';
import { Client } from '../../domain/protocols';

const makeFakeId = (): any => {
  return { id: 'valid_id' };
};

const makeFakeClient = (): Client => {
  return {
    name: 'fake client',
    email: 'mail@mail.com',
  };
};

const makeFakeClientsResult = (): ClientsList => {
  const { name, email } = makeFakeClient();
  return {
    clients: [
      {
        _id: 'valid_id',
        name,
        email,
        favorites: [
          {
            id: 'valid_product_id',
            price: 1,
            image: 'valid_image',
            brand: 'valid_brand',
            title: 'valid_title',
          },
        ],
      },
    ],
  };
};

const makeGetClients = (): GetClients => {
  class GetClientStub implements GetClients {
    getClients(): Promise<Partial<ClientsList>> {
      return new Promise((resolve) => resolve(makeFakeClientsResult()));
    }
  }

  return new GetClientStub();
};

interface ControllerStub {
  sut: GetClientsController;
  getClientsStub: GetClients;
}

const makeSut = (): ControllerStub => {
  const getClientsStub = makeGetClients();
  const sut = new GetClientsController(getClientsStub);
  return {
    sut,
    getClientsStub,
  };
};

describe('Get Clients Controller', () => {
  test('should return success if all params is provided', async () => {
    const { sut, getClientsStub } = makeSut();

    const addSpy = jest.spyOn(getClientsStub, 'getClients');

    const httpRequest = makeFakeId();

    await sut.handle(httpRequest);

    expect(addSpy).toHaveBeenCalledWith();
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = makeFakeId();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok(makeFakeClientsResult()));
  });

  test('Should return 500 if GetClients throws', async () => {
    const { sut, getClientsStub } = makeSut();

    jest.spyOn(getClientsStub, 'getClients').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpRequest = makeFakeId();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new ServerError()));
  });

  test('Should return 200 but doest has created clients', async () => {
    const { sut, getClientsStub } = makeSut();

    jest
      .spyOn(getClientsStub, 'getClients')
      .mockReturnValueOnce(new Promise((resolve) => resolve({})));

    const httpResponse = await sut.handle({});
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toMatchObject({});
  });
});
