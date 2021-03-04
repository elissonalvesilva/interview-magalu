import {
  NotFoundClientResponse,
  NotFoundProductResponse,
} from './../../../src/presentation/helpers/stack-errors-favorits';
import { Product } from './../../../src/domain/protocols/product';
import { DbAddFavoritProductClient } from './../../../src/application/use-cases/db-add-favorit-product-client';
import {
  AddFavoritProductClientRepository,
  CheckClientByIdRepository,
  ProductServiceRepository,
} from './../../../src/application/protocols';
import { HttpResponse } from './../../../src/presentation/protocols';

const makeFakeClientId = (): any => {
  return { id: 'valid_id' };
};

const makeFakeProductId = (): any => {
  return { id: 'valid_product_id' };
};

const makeFakeProduct = (): Product => {
  return {
    id: 'valid_product_id',
    price: 1,
    image: 'valid_image',
    brand: 'valid_brand',
    title: 'valid_title',
  };
};

const makeAddFavoritProductClientRepository = (): AddFavoritProductClientRepository => {
  class AddFavoritProductClientRepositoryStub
    implements AddFavoritProductClientRepository {
    add(clientId: string, productId: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }
  return new AddFavoritProductClientRepositoryStub();
};

const makeproductServiceRepository = (): ProductServiceRepository => {
  class ProductServiceRepositoryStub implements ProductServiceRepository {
    getProduct(id: string): Promise<HttpResponse> {
      return new Promise((resolve) =>
        resolve({
          statusCode: 200,
          body: makeFakeProduct(),
        }),
      );
    }
  }
  return new ProductServiceRepositoryStub();
};

const makeCheckClientByIdRepository = (): CheckClientByIdRepository => {
  class CheckClientByIdRepositoryStub implements CheckClientByIdRepository {
    checkClientById(id: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }
  return new CheckClientByIdRepositoryStub();
};

interface SutTypes {
  sut: DbAddFavoritProductClient;
  checkClientByIdRepositoryStub: CheckClientByIdRepository;
  productServiceRepositoryStub: ProductServiceRepository;
  addFavoritProductClientRepositoryStub: AddFavoritProductClientRepository;
}

const makeSut = (): SutTypes => {
  const checkClientByIdRepositoryStub = makeCheckClientByIdRepository();
  const productServiceRepositoryStub = makeproductServiceRepository();
  const addFavoritProductClientRepositoryStub = makeAddFavoritProductClientRepository();
  const sut = new DbAddFavoritProductClient(
    checkClientByIdRepositoryStub,
    productServiceRepositoryStub,
    addFavoritProductClientRepositoryStub,
  );
  return {
    sut,
    checkClientByIdRepositoryStub,
    productServiceRepositoryStub,
    addFavoritProductClientRepositoryStub,
  };
};

describe('DbAddFavoritProductClient UseCase', () => {
  describe('CheckClientByIdRepository', () => {
    test('should call CheckClientByIdRepository with correct values', async () => {
      const { sut, checkClientByIdRepositoryStub } = makeSut();
      const checkClientByIdRepositorySpy = jest.spyOn(
        checkClientByIdRepositoryStub,
        'checkClientById',
      );
      await sut.add(makeFakeClientId().id, makeFakeProductId().id);
      expect(checkClientByIdRepositorySpy).toBeCalledWith(
        makeFakeClientId().id,
      );
    });
    test('should return throw if CheckClientByEmailRepository throws', async () => {
      const { sut, checkClientByIdRepositoryStub } = makeSut();
      jest
        .spyOn(checkClientByIdRepositoryStub, 'checkClientById')
        .mockReturnValueOnce(
          new Promise((resolve, reject) => reject(new Error())),
        );
      const promise = sut.add(makeFakeClientId().id, makeFakeProductId().id);
      await expect(promise).rejects.toThrow();
    });
  });

  describe('ProductServiceRepository', () => {
    test('should call ProductServiceRepository with correct values', async () => {
      const { sut, productServiceRepositoryStub } = makeSut();
      const productServiceRepositorySpy = jest.spyOn(
        productServiceRepositoryStub,
        'getProduct',
      );
      await sut.add(makeFakeClientId().id, makeFakeProductId().id);
      expect(productServiceRepositorySpy).toBeCalledWith(
        makeFakeProductId().id,
      );
    });
    test('should return throw if ProductServiceRepository throws', async () => {
      const { sut, productServiceRepositoryStub } = makeSut();
      jest
        .spyOn(productServiceRepositoryStub, 'getProduct')
        .mockReturnValueOnce(
          new Promise((resolve, reject) => reject(new Error())),
        );
      const promise = sut.add(makeFakeClientId().id, makeFakeProductId().id);
      await expect(promise).rejects.toThrow();
    });
  });

  describe('AddFavoritProductClientRepository', () => {
    test('should call AddFavoritProductClientRepository with correct values', async () => {
      const { sut, addFavoritProductClientRepositoryStub } = makeSut();
      const addFavoritProductClientRepositorySpy = jest.spyOn(
        addFavoritProductClientRepositoryStub,
        'add',
      );
      await sut.add(makeFakeClientId().id, makeFakeProductId().id);
      expect(addFavoritProductClientRepositorySpy).toBeCalledWith(
        makeFakeClientId().id,
        makeFakeProductId().id,
      );
    });
    test('should return throw if AddFavoritProductClientRepository throws', async () => {
      const { sut, addFavoritProductClientRepositoryStub } = makeSut();
      jest
        .spyOn(addFavoritProductClientRepositoryStub, 'add')
        .mockReturnValueOnce(
          new Promise((resolve, reject) => reject(new Error())),
        );
      const promise = sut.add(makeFakeClientId().id, makeFakeProductId().id);
      await expect(promise).rejects.toThrow();
    });
  });

  describe('DbAddFavoritProductClient Response', () => {
    test('should error if clientid no exists', async () => {
      const { sut, checkClientByIdRepositoryStub } = makeSut();

      const fakeStack: NotFoundClientResponse = {
        message: 'Not found client',
        clientid: makeFakeClientId().id,
      };

      jest
        .spyOn(checkClientByIdRepositoryStub, 'checkClientById')
        .mockReturnValueOnce(new Promise((resolve) => resolve(false)));

      const response = await sut.add(
        makeFakeClientId().id,
        makeFakeProductId().id,
      );
      expect(response).toBeTruthy();
      expect(response.added).toBeFalsy();
      expect(response.clientid).toBe(makeFakeClientId().id);
      expect(response.productid).toBe(makeFakeProductId().id);
      expect(response.stack).toMatchObject(fakeStack);
    });

    test('should error if productid no exists', async () => {
      const {
        sut,
        checkClientByIdRepositoryStub,
        productServiceRepositoryStub,
      } = makeSut();

      const fakeStack: NotFoundProductResponse = {
        message: 'Not found product',
        productid: makeFakeProductId().id,
      };

      jest
        .spyOn(checkClientByIdRepositoryStub, 'checkClientById')
        .mockReturnValueOnce(new Promise((resolve) => resolve(true)));

      jest
        .spyOn(productServiceRepositoryStub, 'getProduct')
        .mockReturnValueOnce(
          new Promise((resolve) =>
            resolve({
              statusCode: 404,
              body: {},
            }),
          ),
        );

      const response = await sut.add(
        makeFakeClientId().id,
        makeFakeProductId().id,
      );
      expect(response).toBeTruthy();
      expect(response.added).toBeFalsy();
      expect(response.clientid).toBe(makeFakeClientId().id);
      expect(response.productid).toBe(makeFakeProductId().id);
      expect(response.stack).toMatchObject(fakeStack);
    });

    test('should success if all params exists', async () => {
      const {
        sut,
        checkClientByIdRepositoryStub,
        productServiceRepositoryStub,
      } = makeSut();

      jest
        .spyOn(checkClientByIdRepositoryStub, 'checkClientById')
        .mockReturnValueOnce(new Promise((resolve) => resolve(true)));

      jest
        .spyOn(productServiceRepositoryStub, 'getProduct')
        .mockReturnValueOnce(
          new Promise((resolve) =>
            resolve({
              statusCode: 200,
              body: {},
            }),
          ),
        );

      const response = await sut.add(
        makeFakeClientId().id,
        makeFakeProductId().id,
      );
      expect(response).toBeTruthy();
      expect(response.added).toBeTruthy();
      expect(response.clientid).toBe(makeFakeClientId().id);
      expect(response.productid).toBe(makeFakeProductId().id);
      expect(response.stack).toBeUndefined();
    });
  });
});
