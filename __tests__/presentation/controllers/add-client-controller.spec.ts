import { EmailValidator } from 'presentation/protocols/email-validator';
import {
  InvalidParamError,
  MissingParamError,
} from '../../../src/presentation/erros';
import { badRequest } from '../../../src/presentation/helpers/http-helpers';
import { AddClientController } from './../../../src/presentation/controllers/add-client-controller';

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValidEmail(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

interface ControllerStub {
  sut: AddClientController;
  emailValidatorStub: EmailValidator;
}

const makeStub = (): ControllerStub => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new AddClientController(emailValidatorStub);
  return {
    sut,
    emailValidatorStub,
  };
};
describe('Add Client Controller', () => {
  test('should return erro if name is not provided', async () => {
    const { sut } = makeStub();

    const httpRequest = {
      body: {
        email: 'mail@mail.com',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')));
  });

  test('should return erro if email is not provided', async () => {
    const { sut } = makeStub();

    const httpRequest = {
      body: {
        name: 'Elisson',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  test('should return erro if email is not valid', async () => {
    const { sut, emailValidatorStub } = makeStub();

    jest.spyOn(emailValidatorStub, 'isValidEmail').mockReturnValueOnce(false);

    const httpRequest = {
      body: {
        name: 'Elisson',
        email: 'mailxx.com',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });
});
