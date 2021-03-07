import { DbAddFavoritProductClient } from './../../../application/use-cases/db-add-favorit-product-client';
import { AddFavoritProductClientRepository } from './../../../application/protocols/add-favorit-product-client-repository';
import { CheckAddedFavoritProductRepository } from './../../../application/protocols/check-added-favorit-product';
import { CheckClientByIdRepository } from './../../../application/protocols/check-client-by-id-repository';
import { AddFavoritProductClient } from './../../../domain/use-cases/add-favorit-product-client';
import { ClientMongoRepository } from './../../../infrastructure/database/mongodb/client-mongo-repository';
import { createGetProductService } from '../services';

export const createDbAddFavoritProductClient = (): AddFavoritProductClient => {
  const checkClientByIdRepository: CheckClientByIdRepository = new ClientMongoRepository();
  const checkAddedFavoritProductRepository: CheckAddedFavoritProductRepository = new ClientMongoRepository();
  const productServiceRepository = createGetProductService();
  const addFavoritProductClientRepository: AddFavoritProductClientRepository = new ClientMongoRepository();
  return new DbAddFavoritProductClient(
    checkClientByIdRepository,
    checkAddedFavoritProductRepository,
    productServiceRepository,
    addFavoritProductClientRepository,
  );
};
