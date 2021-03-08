import { GetClientsController } from './../../presentation/controllers/get-clients-controller';
import { Controller } from './../../presentation/protocols/controller';
import { createDbGetClients } from './use-cases';

export const createGetClientsController = (): Controller => {
  const clientController = new GetClientsController(createDbGetClients());
  return clientController;
};
