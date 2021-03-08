import { createDbAuthentication } from './../use-cases/account/authentication-factory';
import { SignUpController } from './../../../presentation/controllers/signup-controller';
import { createEmailValidator } from '../email-validator-factory';
import { Controller } from './../../../presentation/protocols/controller';
import { createDbAddAccount } from '../use-cases/account';

export const createSignUpController = (): Controller => {
  const clientController = new SignUpController(
    createDbAddAccount(),
    createEmailValidator(),
    createDbAuthentication(),
  );
  return clientController;
};
