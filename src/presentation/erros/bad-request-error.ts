import { ErrorResponseStackFavorit } from './../protocols/response-added-favorit-product';

export class BadRequestError extends Error {
  constructor(message?: ErrorResponseStackFavorit) {
    super(JSON.stringify(message));
    this.name = 'BadRequestError';
  }
}
