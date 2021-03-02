import { DeleteClient } from './../../../src/domain/use-cases';
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
import { DeleteClientController } from './../../../src/presentation/controllers/delete-client-controller';
import { SuccessRemove } from './../../../src/presentation/helpers';

const makeFakeClientId = (): any => {
  return { id: 'valid_id' };
};

const makeDeleteClient = (): DeleteClient => {
  class DeleteClientStub implements DeleteClient {
    delete(id: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }

  return new DeleteClientStub();
};

interface SutTypes {
  sut: DeleteClientController;
  deleteClientStub: DeleteClient;
}

const makeSut = (): SutTypes => {
  const deleteClientStub = makeDeleteClient();
  const sut = new DeleteClientController(deleteClientStub);
  return { sut, deleteClientStub };
};

describe('Update Client Controller', () => {
  test('should return erro if id is not provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {};

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('id')));
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = makeFakeClientId();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok(SuccessRemove(makeFakeClientId().id)));
  });

  test('Should return 500 if DeleteClient throws', async () => {
    const { sut, deleteClientStub } = makeSut();

    jest.spyOn(deleteClientStub, 'delete').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpRequest = makeFakeClientId();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new ServerError()));
  });

  test('Should return 404 if not found param id', async () => {
    const { sut, deleteClientStub } = makeSut();

    jest
      .spyOn(deleteClientStub, 'delete')
      .mockReturnValueOnce(new Promise((resolve, reject) => resolve(false)));

    const httpRequest = makeFakeClientId();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(notFound(new NotFoundParamError('valid_id')));
  });
});
