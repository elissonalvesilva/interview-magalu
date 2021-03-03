import {
  NotFoundClientResponse,
  NotFoundProductResponse,
  ProductAlreadyAddedResponse,
} from './../helpers/stack-errors-favorits';

export type ErrorResponseStackFavorit =
  | NotFoundClientResponse
  | NotFoundProductResponse
  | ProductAlreadyAddedResponse;

export interface ResponseAddFavoritProduct {
  added: boolean;
  clientid: string;
  productid: string;
  stack?: ErrorResponseStackFavorit;
}
