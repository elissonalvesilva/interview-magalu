import { createDbAuthentication } from './../use-cases/account/authentication-factory';
import { LoginController } from './../../../presentation/controllers/login-controller';
import { createEmailValidator } from '../email-validator-factory';
import { Controller } from './../../../presentation/protocols/controller';

export const createLoginController = (): Controller => {
  const clientController = new LoginController(
    createDbAuthentication(),
    createEmailValidator(),
  );
  return clientController;
};
