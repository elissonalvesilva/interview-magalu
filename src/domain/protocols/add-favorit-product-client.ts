import { ResponseAddFavoritProduct } from './../../presentation/protocols/response-added-favorit-product';

export interface AddFavoritProductClient {
  add(clientId: string, productId: string): Promise<ResponseAddFavoritProduct>;
}
