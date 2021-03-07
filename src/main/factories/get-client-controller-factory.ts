import { GetClientController } from './../../presentation/controllers/get-client-controller';
import { Controller } from './../../presentation/protocols/controller';
import { createDbGetClient } from './use-cases';

export const createGetClientController = (): Controller => {
  const clientController = new GetClientController(createDbGetClient());
  return clientController;
};
