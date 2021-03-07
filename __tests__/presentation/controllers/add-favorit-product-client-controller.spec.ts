import {
  NotFoundClientResponse,
  NotFoundProductResponse,
  ProductAlreadyAddedResponse,
} from './../../../src/presentation/helpers/stack-errors-favorits';
import { AddFavoritProductClient } from './../../../src/domain/use-cases/add-favorit-product-client';
import { ResponseAddFavoritProduct } from './../../../src/domain/protocols';
import {
  BadRequestError,
  MissingParamError,
  ServerError,
} from '../../../src/presentation/erros';
import {
  badRequest,
  ok,
  serverError,
} from '../../../src/presentation/helpers/http-helpers';
import { AddFavoritProductClientController } from './../../../src/presentation/controllers/add-favorit-product-client-controller';

const makeFakeClientId = (): any => {
  return { clientid: 'valid_id' };
};

const makeFakeProductId = (): any => {
  return { productid: 'valid_product_id' };
};

const makeFakeRequest = (): any => {
  const { clientid } = makeFakeClientId();
  const { productid } = makeFakeProductId();

  return {
    clientid,
    productid,
  };
};

const makeFakeAddedFavoritResponse = (): ResponseAddFavoritProduct => {
  const { clientid } = makeFakeClientId();
  const { productid } = makeFakeProductId();

  return {
    clientid,
    productid,
    added: true,
  };
};

const makeAddFavoritProductCliente = (): AddFavoritProductClient => {
  class addFavoritProductClientStub implements AddFavoritProductClient {
    add(
      clientId: string,
      productId: string,
    ): Promise<ResponseAddFavoritProduct> {
      return new Promise((resolve) => resolve(makeFakeAddedFavoritResponse()));
    }
  }

  return new addFavoritProductClientStub();
};

interface ControllerStub {
  sut: AddFavoritProductClientController;
  addFavoritProductClientStub: AddFavoritProductClient;
}

const makeSut = (): ControllerStub => {
  const addFavoritProductClientStub = makeAddFavoritProductCliente();
  const sut = new AddFavoritProductClientController(
    addFavoritProductClientStub,
  );
  return {
    sut,
    addFavoritProductClientStub,
  };
};

describe('Add Favorit Product Client Controller', () => {
  test('should return erro if clientid is not provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      productid: makeFakeRequest().productid,
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('clientid')));
  });

  test('should return erro if productid is not provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      clientid: makeFakeRequest().clientid,
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('productid')),
    );
  });

  test('should return success if all params is provided', async () => {
    const { sut, addFavoritProductClientStub } = makeSut();

    const addSpy = jest.spyOn(addFavoritProductClientStub, 'add');

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(addSpy).toHaveBeenCalledWith(
      httpRequest.clientid,
      httpRequest.productid,
    );
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok(makeFakeAddedFavoritResponse()));
  });

  test('Should return 500 if AddFavoritProductClient throws', async () => {
    const { sut, addFavoritProductClientStub } = makeSut();

    jest
      .spyOn(addFavoritProductClientStub, 'add')
      .mockImplementationOnce(() => {
        throw new Error();
      });

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new ServerError()));
  });

  test('Should return 400 if clientid not Found', async () => {
    const { sut, addFavoritProductClientStub } = makeSut();

    const fakeResponse = makeFakeAddedFavoritResponse();
    const fakeStack: NotFoundClientResponse = {
      message: 'not found clientid',
      clientid: makeFakeRequest().clientid,
    };
    fakeResponse.added = false;
    fakeResponse.stack = fakeStack;

    jest
      .spyOn(addFavoritProductClientStub, 'add')
      .mockReturnValueOnce(new Promise((resolve) => resolve(fakeResponse)));

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new BadRequestError(fakeStack)));
  });

  test('Should return 400 if clientid not Found', async () => {
    const { sut, addFavoritProductClientStub } = makeSut();

    const fakeResponse = makeFakeAddedFavoritResponse();
    const fakeStack: NotFoundProductResponse = {
      message: 'not found productid',
      productid: makeFakeRequest().productid,
    };
    fakeResponse.added = false;
    fakeResponse.stack = fakeStack;

    jest
      .spyOn(addFavoritProductClientStub, 'add')
      .mockReturnValueOnce(new Promise((resolve) => resolve(fakeResponse)));

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new BadRequestError(fakeStack)));
  });

  test('Should return 400 if clientid not Found', async () => {
    const { sut, addFavoritProductClientStub } = makeSut();

    const fakeResponse = makeFakeAddedFavoritResponse();
    const fakeStack: ProductAlreadyAddedResponse = {
      message: 'product already added',
      productid: makeFakeRequest().productid,
    };
    fakeResponse.added = false;
    fakeResponse.stack = fakeStack;

    jest
      .spyOn(addFavoritProductClientStub, 'add')
      .mockReturnValueOnce(new Promise((resolve) => resolve(fakeResponse)));

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new BadRequestError(fakeStack)));
  });

  test('Should return 400 if stack is not added', async () => {
    const { sut, addFavoritProductClientStub } = makeSut();

    const fakeResponse = makeFakeAddedFavoritResponse();

    fakeResponse.added = false;

    jest
      .spyOn(addFavoritProductClientStub, 'add')
      .mockReturnValueOnce(new Promise((resolve) => resolve(fakeResponse)));

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new BadRequestError()));
  });
});
