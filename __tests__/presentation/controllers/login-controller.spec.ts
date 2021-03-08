import { InvalidParamError } from './../../../src/presentation/erros/invalid-param-error';
import { EmailValidator } from './../../../src/presentation/protocols/email-validator';
import { MissingParamError } from './../../../src/presentation/erros/missing-param-error';
import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from './../../../src/presentation/helpers/http-helpers';
import { Authentication } from './../../../src/domain/use-cases/authentication';
import {
  AuthenticationParams,
  AuthenticationResult,
} from './../../domain/protocols';
import { LoginController } from './../../../src/presentation/controllers/login-controller';
import faker from 'faker';

const makeFakeRequest = (): any => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});

const fakeAccess = (): any => ({
  accessToken: faker.random.uuid(),
  name: faker.name.findName(),
});

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
      return new Promise((resolve) => resolve(fakeAccess()));
    }
  }
  return new AuthenticationStub();
};
type SutTypes = {
  sut: LoginController;
  authenticationStub: Authentication;
  emailValidatorStub: EmailValidator;
};

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication();
  const emailValidatorStub = makeEmailValidator();
  const sut = new LoginController(authenticationStub, emailValidatorStub);
  return {
    sut,
    authenticationStub,
    emailValidatorStub,
  };
};

describe('Login Controller', () => {
  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const request = makeFakeRequest();

    const authenticationSpy = jest.spyOn(authenticationStub, 'auth');

    await sut.handle(request);
    expect(authenticationSpy).toHaveBeenCalledWith({
      email: request.email,
      password: request.password,
    });
  });

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut();
    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(unauthorized());
  });

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut();

    const fakeAcessResponse = fakeAccess();

    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(
        new Promise((resolve) => resolve(fakeAcessResponse)),
      );

    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(fakeAcessResponse));
  });

  test('should return erro if email is not provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      password: '123',
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  test('should return erro if email is not provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      email: 'elisson.silva@mail.com',
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  test('should return erro if email is not valid', async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValidEmail').mockReturnValueOnce(false);

    const httpRequest = {
      email: 'mailxx.com',
      password: '123',
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });
});
