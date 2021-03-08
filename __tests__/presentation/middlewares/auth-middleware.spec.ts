import { AccessDeniedError } from './../../../src/presentation/erros';
import {
  forbidden,
  ok,
  serverError,
} from './../../../src/presentation/helpers';
import {
  GetAccountByToken,
  GetAccountByTokenResult,
} from './../../../src/domain/use-cases';
import { AuthMiddleware } from './../../../src/presentation/protocols/auth-middleware';

const fakeId = 'valid_id';

const makeFakeRequestUpdate = (): any => ({
  accessToken: 'any_token',
});

const makeFakeGetAccountByToken = (): GetAccountByToken => {
  class GetAccountByTokenStub implements GetAccountByToken {
    load(
      accessToken: string,
      role?: string,
    ): Promise<GetAccountByTokenResult | null> {
      return new Promise((resolve) =>
        resolve({
          id: fakeId,
        }),
      );
    }
  }
  return new GetAccountByTokenStub();
};

type SutTypes = {
  sut: AuthMiddleware;
  getAccountByTokenStub: GetAccountByToken;
};

const makeSut = (): SutTypes => {
  const getAccountByTokenStub = makeFakeGetAccountByToken();
  const sut = new AuthMiddleware(getAccountByTokenStub);
  return {
    sut,
    getAccountByTokenStub,
  };
};

describe('Auth Middleware', () => {
  test('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const { sut, getAccountByTokenStub } = makeSut();

    const getAccountByTokenSpy = jest.spyOn(getAccountByTokenStub, 'load');

    const httpRequest = makeFakeRequestUpdate();
    await sut.handle(httpRequest);
    expect(getAccountByTokenSpy).toHaveBeenCalledWith(httpRequest.accessToken);
  });

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, getAccountByTokenStub } = makeSut();
    jest
      .spyOn(getAccountByTokenStub, 'load')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
    const httpResponse = await sut.handle(makeFakeRequestUpdate());
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequestUpdate());
    expect(httpResponse).toEqual(
      ok({
        accountId: fakeId,
      }),
    );
  });

  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, getAccountByTokenStub } = makeSut();
    jest.spyOn(getAccountByTokenStub, 'load').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpResponse = await sut.handle(makeFakeRequestUpdate());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
