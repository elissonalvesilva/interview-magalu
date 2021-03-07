import { DeleteClientController } from './../../presentation/controllers/delete-client-controller';
import { Controller } from './../../presentation/protocols/controller';
import { createDbDeleteClient } from './use-cases';

export const createDeleteClientController = (): Controller => {
  const clientController = new DeleteClientController(createDbDeleteClient());
  return clientController;
};
