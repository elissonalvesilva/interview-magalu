import { ProductServiceRepository } from './../protocols/product-service-repository';
import { GetClientRepository } from './../protocols/get-client-repository';
import { ClientResult } from './../../domain/protocols';
import { GetClient } from './../../domain/use-cases';

export class DbGetClient implements GetClient {
  constructor(
    private getClientRepository: GetClientRepository,
    private productServiceRepository: ProductServiceRepository,
  ) {}

  async get(id: string): Promise<Partial<ClientResult>> {
    const client = await this.getClientRepository.getClient(id);

    if (!client) {
      return {};
    }

    const response: Partial<ClientResult> = {
      name: client.name,
      email: client.email,
    };

    const productList = client.favorites;

    if (productList) {
      const promises = productList.map(async (productId) => {
        return this.getProduct(productId);
      });

      const result = await Promise.all(promises);
      response.favorites = result;
    } else {
      response.favorites = [];
    }

    return response;
  }

  private async getProduct(productId: string): Promise<any> {
    /**
     * TODO: Adicionar estrategia de cache para que ao buscar um produto, validar
     * se o mesmo já foi adicionado anteriormente por alguem, caso sim, já retorna do cache
     * fazendo com que haja menos custo ao fazer requests externas
     */
    const { statusCode, body } = await this.productServiceRepository.getProduct(
      productId,
    );
    if (statusCode < 300) {
      return body;
    }
    return;
  }
}
