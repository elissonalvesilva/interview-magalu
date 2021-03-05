import { HttpResponse } from './../../presentation/protocols';
import {
  HttpClient,
  HttpRequest,
} from './../../../src/application/protocols/http/http-client';
import { GetProductService } from './../../../src/infrastructure/services/get-product-service';

const urlAPI = 'https://google.com';
const fakeId = 'valid_id';

const makeHttpClient = (): HttpClient => {
  class HttpClientStub implements HttpClient {
    async request(data: HttpRequest): Promise<HttpResponse> {
      return new Promise((resolve) =>
        resolve({
          statusCode: 200,
          body: {
            data: 'a',
          },
        }),
      );
    }
  }
  return new HttpClientStub();
};

interface SutTypes {
  sut: GetProductService;
  httpClientStub: HttpClient;
}

const makeSut = (): SutTypes => {
  const httpClientStub = makeHttpClient();
  const sut = new GetProductService(urlAPI, httpClientStub);
  return {
    sut,
    httpClientStub,
  };
};

describe('GetProductService', () => {
  test('should call HttpClient with correct values', async () => {
    const { sut, httpClientStub } = makeSut();

    const httpClientStubSpy = jest.spyOn(httpClientStub, 'request');
    const fakeConfig = {
      method: 'get',
      url: `${urlAPI}/${fakeId}`,
    };

    await sut.getProduct(fakeId);
    expect(httpClientStubSpy).toBeCalledWith(fakeConfig);
  });

  test('should return throw if HttpClient throws', async () => {
    const { sut, httpClientStub } = makeSut();

    jest
      .spyOn(httpClientStub, 'request')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error())),
      );

    const promise = sut.getProduct(fakeId);
    await expect(promise).rejects.toThrow();
  });
});
