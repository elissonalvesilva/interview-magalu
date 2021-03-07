import { HttpResponse } from './../../../src/presentation/protocols/http';
import { ProductServiceRepository } from './../../../src/application/protocols/product-service-repository';
import { Product } from './../../../src/domain/protocols/product';
import { DbGetClient } from './../../../src/application/use-cases';
import { GetClientRepository } from 'application/protocols';
import { Client } from 'domain/protocols';
import { response } from 'express';

const id = 'valid_id';

const makeFakeClient = (): Client => ({
  name: 'valid name',
  email: 'mail@mail.com',
  favorites: ['123', '12345'],
});

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
  productServiceRepositoryStub: ProductServiceRepository;
}

const makeSut = (): SutTypes => {
  const getClientRepositoryStub = makeGetClientRepository();
  const productServiceRepositoryStub = makeproductServiceRepository();
  const sut = new DbGetClient(
    getClientRepositoryStub,
    productServiceRepositoryStub,
  );
  return {
    sut,
    getClientRepositoryStub,
    productServiceRepositoryStub,
  };
};

describe('DbGetClient UseCase', () => {
  describe('get Method', () => {
    test('should return empty favorits if clients has anyone', async () => {
      const { sut, getClientRepositoryStub } = makeSut();
      jest
        .spyOn(getClientRepositoryStub, 'getClient')
        .mockImplementationOnce(() => {
          return new Promise((resolve) =>
            resolve({
              name: 'valid name',
              email: 'mail@mail.com',
            }),
          );
        });

      const response = await sut.get(id);
      expect(response.favorites).toEqual([]);
    });

    test('should return empty client if clients not found', async () => {
      const { sut, getClientRepositoryStub } = makeSut();
      jest
        .spyOn(getClientRepositoryStub, 'getClient')
        .mockImplementationOnce(() => {
          return new Promise((resolve) => resolve({}));
        });

      const response = await sut.get(id);
      expect(response.name).toBeUndefined();
      expect(response.email).toBeUndefined();
    });
  });

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
  describe('ProductServiceRepository', () => {
    test('should call ProductServiceRepository with correct values', async () => {
      const {
        sut,
        getClientRepositoryStub,
        productServiceRepositoryStub,
      } = makeSut();

      jest
        .spyOn(getClientRepositoryStub, 'getClient')
        .mockImplementationOnce(() => {
          return new Promise((resolve) => resolve(makeFakeClient()));
        });

      const productServiceRepositorySpy = jest.spyOn(
        productServiceRepositoryStub,
        'getProduct',
      );

      await sut.get(id);

      expect(productServiceRepositorySpy).toHaveBeenCalled();
    });

    test('should return throw if ProductServiceRepository throws', async () => {
      const {
        sut,
        getClientRepositoryStub,
        productServiceRepositoryStub,
      } = makeSut();

      jest
        .spyOn(getClientRepositoryStub, 'getClient')
        .mockImplementationOnce(() => {
          return new Promise((resolve) => resolve(makeFakeClient()));
        });

      jest
        .spyOn(productServiceRepositoryStub, 'getProduct')
        .mockReturnValueOnce(
          new Promise((resolve, reject) => reject(new Error())),
        );

      const promise = sut.get(id);
      await expect(promise).rejects.toThrow();
    });

    test('should return nothing if ProductServiceRepository answer with statusCode > 300', async () => {
      const {
        sut,
        getClientRepositoryStub,
        productServiceRepositoryStub,
      } = makeSut();

      jest
        .spyOn(getClientRepositoryStub, 'getClient')
        .mockImplementationOnce(() => {
          return new Promise((resolve) =>
            resolve({
              name: 'valid name',
              email: 'mail@mail.com',
              favorites: ['invalid_id'],
            }),
          );
        });

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

      const response = await sut.get(id);
      await expect(response.favorites).toEqual([undefined]);
    });
  });
});
