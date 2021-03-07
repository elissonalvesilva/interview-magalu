import {
  DeleteClientRepository,
  CheckClientByIdRepository,
} from './../../../application/protocols';
import { DbDeleteClient } from './../../../application/use-cases';
import { ClientMongoRepository } from './../../../infrastructure/database/mongodb/client-mongo-repository';
import { DeleteClient } from './../../../domain/use-cases';

export const createDbDeleteClient = (): DeleteClient => {
  const deleteClientRepository: DeleteClientRepository = new ClientMongoRepository();
  const checkClientByIdRepository: CheckClientByIdRepository = new ClientMongoRepository();
  return new DbDeleteClient(deleteClientRepository, checkClientByIdRepository);
};
