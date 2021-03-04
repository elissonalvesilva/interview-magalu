import {
  NotFoundClientResponse,
  NotFoundProductResponse,
} from './../../presentation/helpers/stack-errors-favorits';
import {
  CheckClientByIdRepository,
  ProductServiceRepository,
  AddFavoritProductClientRepository,
} from './../protocols';
import { AddFavoritProductClient } from './../../domain/protocols/add-favorit-product-client';
import { ResponseAddFavoritProduct } from './../../presentation/protocols';

export class DbAddFavoritProductClient implements AddFavoritProductClient {
  constructor(
    private checkClientByIdRepository: CheckClientByIdRepository,
    private productServiceRepository: ProductServiceRepository,
    private addFavoritProductClient: AddFavoritProductClientRepository,
  ) {}

  async add(
    clientId: string,
    productId: string,
  ): Promise<ResponseAddFavoritProduct> {
    const responseAddFavoritProduct: ResponseAddFavoritProduct = {
      added: false,
      clientid: clientId,
      productid: productId,
    };

    const existsClient = await this.checkClientByIdRepository.checkClientById(
      clientId,
    );

    if (!existsClient) {
      const fakeStack: NotFoundClientResponse = {
        message: 'Not found client',
        clientid: clientId,
      };
      responseAddFavoritProduct.stack = fakeStack;

      return responseAddFavoritProduct;
    }

    const product = await this.productServiceRepository.getProduct(productId);

    if (product.statusCode >= 400) {
      const fakeStack: NotFoundProductResponse = {
        message: 'Not found product',
        productid: productId,
      };
      responseAddFavoritProduct.stack = fakeStack;

      return responseAddFavoritProduct;
    }

    await this.addFavoritProductClient.add(clientId, productId);

    responseAddFavoritProduct.added = true;

    return responseAddFavoritProduct;
  }
}