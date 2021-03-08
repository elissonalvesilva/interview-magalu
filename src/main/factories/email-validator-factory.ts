import { EmailValidator } from './../../presentation/protocols/email-validator';
import { EmailValidatorAdapter } from './../../infrastructure/validators/email-validator-adapter';

export const createEmailValidator = (): EmailValidator => {
  const validator = new EmailValidatorAdapter();
  return validator;
};
