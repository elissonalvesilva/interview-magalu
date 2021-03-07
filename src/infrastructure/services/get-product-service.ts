import { HttpClient } from './../../application/protocols';
import { HttpResponse } from './../../presentation/protocols';
import { ProductServiceRepository } from './../../application/protocols/product-service-repository';

export class GetProductService implements ProductServiceRepository {
  constructor(private urlAPI: string, private httpClient: HttpClient) {}

  async getProduct(id: string): Promise<HttpResponse> {
    const request = await this.httpClient.request({
      method: 'get',
      url: `${this.urlAPI}/${id}/`,
    });

    return request;
  }
}
