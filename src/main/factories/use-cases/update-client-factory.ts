import {
  UpdateClientRepository,
  CheckClientByIdRepository,
} from './../../../application/protocols';
import { DbUpdateClient } from './../../../application/use-cases';
import { ClientMongoRepository } from './../../../infrastructure/database/mongodb/client-mongo-repository';
import { UpdateClient } from './../../../domain/use-cases';

export const createDbUpdateClient = (): UpdateClient => {
  const updateClientRepository: UpdateClientRepository = new ClientMongoRepository();
  const checkClientByIdRepository: CheckClientByIdRepository = new ClientMongoRepository();
  return new DbUpdateClient(updateClientRepository, checkClientByIdRepository);
};
