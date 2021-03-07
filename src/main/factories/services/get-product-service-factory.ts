import { AxiosHttpClient } from './../../../infrastructure/http/axios-http-client';
import { GetProductService } from './../../../infrastructure/services/get-product-service';

export const createGetProductService = (): GetProductService => {
  const uriAPI = process.env.API_PRODUCT || '';
  const httpClient = new AxiosHttpClient();
  return new GetProductService(uriAPI, httpClient);
};
