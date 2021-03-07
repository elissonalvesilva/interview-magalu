import { AddFavoritProductClientController } from './../../presentation/controllers/add-favorit-product-client-controller';
import { Controller } from './../../presentation/protocols/controller';
import { createDbAddFavoritProductClient } from './use-cases';

export const createAddFavoritProductClientController = (): Controller => {
  const clientController = new AddFavoritProductClientController(
    createDbAddFavoritProductClient(),
  );
  return clientController;
};
