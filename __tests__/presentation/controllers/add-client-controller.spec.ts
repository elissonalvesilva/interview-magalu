import { AddClient } from './../../domain/use-cases';
import { EmailValidator } from 'presentation/protocols/email-validator';
import {
  InvalidParamError,
  MissingParamError,
  ServerError,
} from '../../../src/presentation/erros';
import {
  badRequest,
  ok,
  serverError,
} from '../../../src/presentation/helpers/http-helpers';
import { AddClientController } from './../../../src/presentation/controllers/add-client-controller';
import { Client } from '../../domain/protocols';
import { EmailInUseError } from './../../../src/presentation/erros/email-in-use-error';

const makeFakeClient = (): Client => {
  return {
    name: 'fake client',
    email: 'mail@mail.com',
  };
};

const makeAddCliente = (): AddClient => {
  class AddClientStub implements AddClient {
    add(client: Client): Promise<boolean> {
      const fakeClient = makeFakeClient();

      return new Promise((resolve) => resolve(true));
    }
  }

  return new AddClientStub();
};

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
  addClientStub: AddClient;
}

const makeSut = (): ControllerStub => {
  const emailValidatorStub = makeEmailValidator();
  const addClientStub = makeAddCliente();

  const sut = new AddClientController(emailValidatorStub, addClientStub);
  return {
    sut,
    emailValidatorStub,
    addClientStub,
  };
};

describe('Add Client Controller', () => {
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

  test('should return erro if email is not valid', async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValidEmail').mockReturnValueOnce(false);

    const httpRequest = {
      name: 'Elisson',
      email: 'mailxx.com',
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  test('Should call EmailValidor with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValidEmail');

    const httpRequest = makeFakeClient();

    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith('mail@mail.com');
  });

  test('Should return 500 if EmailValidaor throws', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest
      .spyOn(emailValidatorStub, 'isValidEmail')
      .mockImplementationOnce(() => {
        throw new Error();
      });
    const httpRequest = makeFakeClient();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new ServerError()));
  });

  test('should return success if all params is provided', async () => {
    const { sut, addClientStub } = makeSut();

    const addSpy = jest.spyOn(addClientStub, 'add');

    const httpRequest = makeFakeClient();

    await sut.handle(httpRequest);

    expect(addSpy).toHaveBeenCalledWith(makeFakeClient());
  });

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = makeFakeClient();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok(makeFakeClient()));
  });

  test('Should return 500 if AddClient throws', async () => {
    const { sut, addClientStub } = makeSut();

    jest.spyOn(addClientStub, 'add').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpRequest = makeFakeClient();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new ServerError()));
  });

  test('Should return 400 if email already in use', async () => {
    const { sut, addClientStub } = makeSut();

    jest
      .spyOn(addClientStub, 'add')
      .mockReturnValueOnce(new Promise((resolve) => resolve(false)));

    const httpRequest = makeFakeClient();
    const { email } = httpRequest;

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new EmailInUseError(email)));
  });
});
