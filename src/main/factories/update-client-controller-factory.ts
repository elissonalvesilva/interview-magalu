import { UpdateClientController } from './../../presentation/controllers/update-client-controller';
import { Controller } from './../../presentation/protocols/controller';
import { createDbUpdateClient } from './use-cases';

export const createUpdateClientController = (): Controller => {
  const clientController = new UpdateClientController(createDbUpdateClient());
  return clientController;
};
