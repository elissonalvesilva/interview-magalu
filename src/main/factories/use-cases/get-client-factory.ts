import { GetClientRepository } from './../../../application/protocols/get-client-repository';
import { DbGetClient } from './../../../application/use-cases/db-get-client';
import { ClientMongoRepository } from './../../../infrastructure/database/mongodb/client-mongo-repository';
import { createGetProductService } from '../services';

export const createDbGetClient = (): DbGetClient => {
  const getClientRepository: GetClientRepository = new ClientMongoRepository();
  const productServiceRepository = createGetProductService();
  return new DbGetClient(getClientRepository, productServiceRepository);
};
