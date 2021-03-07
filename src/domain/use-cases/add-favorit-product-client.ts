import { ResponseAddFavoritProduct } from './../protocols';

export interface AddFavoritProductClient {
  add(clientId: string, productId: string): Promise<ResponseAddFavoritProduct>;
}
