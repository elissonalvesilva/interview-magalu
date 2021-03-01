import { UpdateClient } from './../../../src/domain/use-cases';
import {
  MissingParamError,
  NotFoundParamError,
  ServerError,
} from './../../../src/presentation/erros';
import {
  badRequest,
  notFound,
  ok,
  serverError,
} from './../../../src/presentation/helpers/http-helpers';
import { UpdateClientController } from './../../../src/presentation/controllers/update-client-controller';
import { Client } from 'domain/protocols';

const makeFakeClient = (): Client => {
  return {
    id: 'valid_id',
    name: 'fake client',
    email: 'mail@mail.com',
  };
};
const makeUpdateClient = (): UpdateClient => {
  class UpdateClientStub implements UpdateClient {
    update(client: Client): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }

  return new UpdateClientStub();
};

interface SutTypes {
  sut: UpdateClientController;
  updateClientStub: UpdateClient;
}

const makeSut = (): SutTypes => {
  const updateClientStub = makeUpdateClient();
  const sut = new UpdateClientController(updateClientStub);
  return { sut, updateClientStub };
};

describe('Update Client Controller', () => {
  test('should return erro if id is not provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      name: 'Elisson',
      email: 'mail@mail.com',
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('id')));
  });
  test('should return erro if name is not provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      id: 'valid_id',
      email: 'mail@mail.com',
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')));
  });

  test('should return erro if email is not provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      id: 'valid_id',
      name: 'Elisson',
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = makeFakeClient();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok(true));
  });

  test('Should return 500 if UpdateClient throws', async () => {
    const { sut, updateClientStub } = makeSut();

    jest.spyOn(updateClientStub, 'update').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpRequest = makeFakeClient();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new ServerError()));
  });

  test('Should return 404 if not found param id', async () => {
    const { sut, updateClientStub } = makeSut();

    jest
      .spyOn(updateClientStub, 'update')
      .mockReturnValueOnce(new Promise((resolve, reject) => resolve(false)));

    const httpRequest = makeFakeClient();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(notFound(new NotFoundParamError('valid_id')));
  });
});
