import { AddClientController } from './../../presentation/controllers/add-client-controller';
import { Controller } from './../../presentation/protocols/controller';
import { createEmailValidator } from './email-validator-factory';
import { createDbAddClient } from './use-cases/add-client.-factory';

export const createAddClientController = (): Controller => {
  const clientController = new AddClientController(
    createEmailValidator(),
    createDbAddClient(),
  );
  return clientController;
};
