import { DbGetClients } from './../../../application/use-cases/db-get-clients';
import { GetClientsRepository } from './../../../application/protocols/get-clients-repository';
import { ClientMongoRepository } from './../../../infrastructure/database/mongodb/client-mongo-repository';

export const createDbGetClients = (): DbGetClients => {
  const getClientRepository: GetClientsRepository = new ClientMongoRepository();
  return new DbGetClients(getClientRepository);
};
