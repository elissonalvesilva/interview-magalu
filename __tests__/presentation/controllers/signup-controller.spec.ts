import { InvalidParamError } from './../../../src/presentation/erros/invalid-param-error';
import faker from 'faker';

import { EmailValidator } from './../../../src/presentation/protocols/email-validator';
import { AddAccount } from './../../../src/domain/use-cases/add-account';
import { Authentication } from './../../../src/domain/use-cases/authentication';
import { MissingParamError } from './../../../src/presentation/erros/missing-param-error';
import { EmailInUseError } from './../../../src/presentation/erros/email-in-use-error';
import {
  badRequest,
  forbidden,
  ok,
  serverError,
} from './../../../src/presentation/helpers/http-helpers';
import { SignUpController } from './../../../src/presentation/controllers/signup-controller';

import { ServerError } from './../../../src/presentation/erros/server-error';
import {
  Account,
  AuthenticationParams,
  AuthenticationResult,
} from 'domain/protocols';

const makeFakeRequest = (): any => {
  const password = faker.internet.password();
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
    passwordConfirmation: password,
  };
};

const makeAddAcount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add(account: Account): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }
  return new AddAccountStub();
};

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValidEmail(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    auth(
      authenticationParams: AuthenticationParams,
    ): Promise<AuthenticationResult> {
      return new Promise((resolve) =>
        resolve({
          accessToken: faker.random.uuid(),
          name: faker.name.findName(),
        }),
      );
    }
  }
  return new AuthenticationStub();
};

type SutTypes = {
  sut: SignUpController;
  addAccountStub: AddAccount;
  emailValidatorStub: EmailValidator;
  authenticationStub: Authentication;
};

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication();
  const addAccountStub = makeAddAcount();
  const emailValidatorStub = makeEmailValidator();
  const sut = new SignUpController(
    addAccountStub,
    emailValidatorStub,
    authenticationStub,
  );
  return {
    sut,
    addAccountStub,
    emailValidatorStub,
    authenticationStub,
  };
};

describe('SignUp Controller', () => {
  test('should return erro if name is not provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      email: 'mail@mail.com',
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')));
  });

  test('should return erro if email is not provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      name: 'Elisson',
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  test('should return erro if password is not provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      name: 'Elisson',
      email: 'mail@mail.com',
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  test('should return erro if passwordConfirmation is not provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      name: 'Elisson',
      email: 'mail@mail.com',
      password: '123',
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('passwordConfirmation')),
    );
  });

  test('should return erro if email is not valid', async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValidEmail').mockReturnValueOnce(false);

    const httpRequest = {
      name: 'Elisson',
      email: 'mailxx.com',
      password: '123',
      passwordConfirmation: '123',
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  test('Should call EmailValidor with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValidEmail');

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.email);
  });

  test('Should return 500 if EmailValidaor throws', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest
      .spyOn(emailValidatorStub, 'isValidEmail')
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new ServerError()));
  });

  test('should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new ServerError('')));
  });

  test('Should return 403 if AddAccount returns false', async () => {
    const { sut, addAccountStub } = makeSut();
    jest
      .spyOn(addAccountStub, 'add')
      .mockReturnValueOnce(new Promise((resolve) => resolve(false)));

    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(
      forbidden(new EmailInUseError(httpRequest.email)),
    );
  });

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const request = makeFakeRequest();

    const authenticationSpy = jest.spyOn(authenticationStub, 'auth');

    await sut.handle(request);
    expect(authenticationSpy).toBeCalledWith({
      email: request.email,
      password: request.password,
    });
  });

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
