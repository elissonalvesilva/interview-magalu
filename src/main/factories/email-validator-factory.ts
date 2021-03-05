import { EmailValidator } from './../../presentation/protocols/email-validator';
import { EmailValidatorAdapter } from './../../../src/infrastructure/validators/email-validator-adapter';

export const createEmailValidator = (): EmailValidator => {
  const validator = new EmailValidatorAdapter();
  return validator;
};
