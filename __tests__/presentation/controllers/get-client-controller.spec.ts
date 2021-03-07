import { GetClient } from './../../domain/use-cases';
import {
  MissingParamError,
  NotFoundParamError,
  ServerError,
} from '../../../src/presentation/erros';
import {
  badRequest,
  notFound,
  ok,
  serverError,
} from '../../../src/presentation/helpers/http-helpers';
import { GetClientController } from './../../../src/presentation/controllers/get-client-controller';
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

const makeGetCliente = (): GetClient => {
  class GetClientStub implements GetClient {
    get(id: string): Promise<Partial<Client>> {
      const fakeClient = makeFakeClient();

      return new Promise((resolve) => resolve(fakeClient));
    }
  }

  return new GetClientStub();
};

interface ControllerStub {
  sut: GetClientController;
  getClientStub: GetClient;
}

const makeSut = (): ControllerStub => {
  const getClientStub = makeGetCliente();
  const sut = new GetClientController(getClientStub);
  return {
    sut,
    getClientStub,
  };
};

describe('Get Client Controller', () => {
  test('should return erro if id is not provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {};

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('id')));
  });

  test('should return success if all params is provided', async () => {
    const { sut, getClientStub } = makeSut();

    const addSpy = jest.spyOn(getClientStub, 'get');

    const httpRequest = makeFakeId();

    await sut.handle(httpRequest);

    expect(addSpy).toHaveBeenCalledWith(makeFakeId().id);
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = makeFakeId();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok(makeFakeClient()));
  });

  test('Should return 500 if GetClient throws', async () => {
    const { sut, getClientStub } = makeSut();

    jest.spyOn(getClientStub, 'get').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpRequest = makeFakeId();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new ServerError()));
  });

  test('Should return 404 if id not Found', async () => {
    const { sut, getClientStub } = makeSut();

    jest
      .spyOn(getClientStub, 'get')
      .mockReturnValueOnce(new Promise((resolve) => resolve({})));

    const httpRequest = makeFakeId();
    const { id } = httpRequest;

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(notFound(new NotFoundParamError(id)));
  });
});
