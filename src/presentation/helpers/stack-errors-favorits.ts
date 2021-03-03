interface ErrorsResponse {
  message: string;
}

export interface NotFoundClientResponse extends ErrorsResponse {
  clientid: string;
}

export interface NotFoundProductResponse extends ErrorsResponse {
  productid: string;
}

export interface ProductAlreadyAddedResponse extends ErrorsResponse {
  productid: string;
}
