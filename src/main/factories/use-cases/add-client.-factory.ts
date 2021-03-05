import { DbAddClient } from './../../../application/use-cases/db-add-client';
import { ClientMongoRepository } from './../../../infrastructure/database/mongodb/client-mongo-repository';
import { AddClient } from './../../../domain/use-cases/add-client';

export const createDbAddClient = (): AddClient => {
  const clientMongoRepository = new ClientMongoRepository();
  return new DbAddClient(clientMongoRepository, clientMongoRepository);
};
