import { UpdateAccessTokenRepository } from './../../../src/application/protocols/account/update-access-token-repository';
import { CriptograpyEncrypter } from './../../../src/application/protocols/criptography/criptography-encrypt';
import { CriptograpyHashComparer } from './../../../src/application/protocols/criptography/criptography-hasher-compare';
import {
  AccountResponse,
  GetAccountByEmailRepository,
} from './../../../src/application/protocols/account/get-account-by-email-repository';
import faker from 'faker';

import { DbAuthentication } from './../../../src/application/use-cases/db-authentication';

const makeFakeAccount = (): any => {
  const password = faker.internet.password();
  return {
    _id: 'valid_id',
    name: faker.name.findName(),
    email: faker.internet.email(),
    password,
  };
};

const makeCriptographtHashComparer = (): CriptograpyHashComparer => {
  class CriptograpyHashComparerStub implements CriptograpyHashComparer {
    compare(plaitext: string, digest: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }
  return new CriptograpyHashComparerStub();
};

const makeCriptographtEncrypter = (): CriptograpyEncrypter => {
  class CriptograpyEncrypterStub implements CriptograpyEncrypter {
    encrypt(plaintext: string): Promise<string> {
      return new Promise((resolve) => resolve('encrypted'));
    }
  }
  return new CriptograpyEncrypterStub();
};

const makeGetAccountByEmailRepository = (): GetAccountByEmailRepository => {
  class GetAccountByEmailRepositoryStub implements GetAccountByEmailRepository {
    async loadByEmail(email: string): Promise<AccountResponse | null> {
      const fakeAccount = makeFakeAccount();
      return new Promise((resolve) => resolve(fakeAccount));
    }
  }
  return new GetAccountByEmailRepositoryStub();
};

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    updateAccessToken(id: string, token: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new UpdateAccessTokenRepositoryStub();
};

type SutTypes = {
  sut: DbAuthentication;
  getAccountByEmailRepositoryStub: GetAccountByEmailRepository;
  hashComparerStub: CriptograpyHashComparer;
  encrypterStub: CriptograpyEncrypter;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
};

const makeSut = (): SutTypes => {
  const getAccountByEmailRepositoryStub = makeGetAccountByEmailRepository();
  const hashComparerStub = makeCriptographtHashComparer();
  const encrypterStub = makeCriptographtEncrypter();
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository();
  const sut = new DbAuthentication(
    getAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub,
  );
  return {
    sut,
    getAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub,
  };
};

describe('DbAuthentication UseCase', () => {
  describe('GetAccountByEmailRepository', () => {
    test('should call GetAccountByEmailRepository with correct email', async () => {
      const { sut, getAccountByEmailRepositoryStub } = makeSut();
      const authenticationParams = makeFakeAccount();

      const getAccountByEmailRepositorySpy = jest.spyOn(
        getAccountByEmailRepositoryStub,
        'loadByEmail',
      );

      await sut.auth(authenticationParams);
      expect(getAccountByEmailRepositorySpy).toBeCalledWith(
        authenticationParams.email,
      );
    });

    test('should return null if account is not found', async () => {
      const { sut, getAccountByEmailRepositoryStub } = makeSut();
      const authenticationParams = makeFakeAccount();

      jest
        .spyOn(getAccountByEmailRepositoryStub, 'loadByEmail')
        .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

      const response = await sut.auth(authenticationParams);
      expect(response).toBeNull();
    });

    test('Should throw if GetAccountByEmailRepository throws', async () => {
      const { sut, getAccountByEmailRepositoryStub } = makeSut();
      jest
        .spyOn(getAccountByEmailRepositoryStub, 'loadByEmail')
        .mockImplementationOnce(() => {
          throw new Error();
        });
      const promise = sut.auth(makeFakeAccount());
      await expect(promise).rejects.toThrow();
    });
  });

  describe('CriptograpyHashComparer', () => {
    test('should call CriptograpyHashComparer with correct values', async () => {
      const {
        sut,
        hashComparerStub,
        getAccountByEmailRepositoryStub,
      } = makeSut();
      const authenticationParams = makeFakeAccount();
      const fakeAccount = makeFakeAccount();

      jest
        .spyOn(getAccountByEmailRepositoryStub, 'loadByEmail')
        .mockReturnValueOnce(new Promise((resolve) => resolve(fakeAccount)));

      const hashComparerSpy = jest.spyOn(hashComparerStub, 'compare');

      await sut.auth(authenticationParams);
      expect(hashComparerSpy).toBeCalledWith(
        authenticationParams.password,
        fakeAccount.password,
      );
    });

    test('should return null if is invalid compare', async () => {
      const {
        sut,
        hashComparerStub,
        getAccountByEmailRepositoryStub,
      } = makeSut();
      const authenticationParams = makeFakeAccount();
      const fakeAccount = makeFakeAccount();

      jest
        .spyOn(getAccountByEmailRepositoryStub, 'loadByEmail')
        .mockReturnValueOnce(new Promise((resolve) => resolve(fakeAccount)));

      jest
        .spyOn(hashComparerStub, 'compare')
        .mockReturnValueOnce(new Promise((resolve) => resolve(false)));

      const response = await sut.auth(authenticationParams);
      expect(response).toBeNull();
    });

    test('Should throw if CriptograpyHashComparer throws', async () => {
      const {
        sut,
        getAccountByEmailRepositoryStub,
        hashComparerStub,
      } = makeSut();
      jest
        .spyOn(getAccountByEmailRepositoryStub, 'loadByEmail')
        .mockReturnValueOnce(
          new Promise((resolve) => resolve(makeFakeAccount())),
        );
      jest.spyOn(hashComparerStub, 'compare').mockImplementationOnce(() => {
        throw new Error();
      });
      const promise = sut.auth(makeFakeAccount());
      await expect(promise).rejects.toThrow();
    });
  });

  describe('CriptograpyEncrypter', () => {
    test('should call CriptograpyEncrypter with correct values', async () => {
      const {
        sut,
        hashComparerStub,
        getAccountByEmailRepositoryStub,
        encrypterStub,
      } = makeSut();
      const authenticationParams = makeFakeAccount();
      const fakeAccount = makeFakeAccount();

      jest
        .spyOn(getAccountByEmailRepositoryStub, 'loadByEmail')
        .mockReturnValueOnce(new Promise((resolve) => resolve(fakeAccount)));

      jest
        .spyOn(hashComparerStub, 'compare')
        .mockReturnValueOnce(new Promise((resolve) => resolve(true)));

      const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt');

      await sut.auth(authenticationParams);
      expect(encrypterSpy).toBeCalledWith(fakeAccount._id);
    });

    test('Should throw if CriptograpyEncrypter throws', async () => {
      const {
        sut,
        hashComparerStub,
        getAccountByEmailRepositoryStub,
        encrypterStub,
      } = makeSut();
      jest
        .spyOn(getAccountByEmailRepositoryStub, 'loadByEmail')
        .mockReturnValueOnce(
          new Promise((resolve) => resolve(makeFakeAccount())),
        );

      jest
        .spyOn(hashComparerStub, 'compare')
        .mockReturnValueOnce(new Promise((resolve) => resolve(true)));

      jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => {
        throw new Error();
      });
      const promise = sut.auth(makeFakeAccount());
      await expect(promise).rejects.toThrow();
    });
  });

  describe('UpdateAccessTokenRepository', () => {
    test('should call UpdateAccessTokenRepository with correct values', async () => {
      const {
        sut,
        hashComparerStub,
        getAccountByEmailRepositoryStub,
        encrypterStub,
        updateAccessTokenRepositoryStub,
      } = makeSut();
      const authenticationParams = makeFakeAccount();
      const fakeAccount = makeFakeAccount();
      const fakeEncrypt = 'fake_encrypt';

      jest
        .spyOn(getAccountByEmailRepositoryStub, 'loadByEmail')
        .mockReturnValueOnce(new Promise((resolve) => resolve(fakeAccount)));

      jest
        .spyOn(hashComparerStub, 'compare')
        .mockReturnValueOnce(new Promise((resolve) => resolve(true)));

      jest
        .spyOn(encrypterStub, 'encrypt')
        .mockReturnValueOnce(new Promise((resolve) => resolve(fakeEncrypt)));

      const updateAccessTokenRepositorySpy = jest.spyOn(
        updateAccessTokenRepositoryStub,
        'updateAccessToken',
      );

      await sut.auth(authenticationParams);
      expect(updateAccessTokenRepositorySpy).toBeCalledWith(
        fakeAccount._id,
        fakeEncrypt,
      );
    });

    test('Should throw if UpdateAccessTokenRepository throws', async () => {
      const {
        sut,
        hashComparerStub,
        getAccountByEmailRepositoryStub,
        encrypterStub,
        updateAccessTokenRepositoryStub,
      } = makeSut();

      const fakeAccount = makeFakeAccount();
      const fakeEncrypt = 'fake_encrypt';

      jest
        .spyOn(getAccountByEmailRepositoryStub, 'loadByEmail')
        .mockReturnValueOnce(new Promise((resolve) => resolve(fakeAccount)));

      jest
        .spyOn(hashComparerStub, 'compare')
        .mockReturnValueOnce(new Promise((resolve) => resolve(true)));

      jest
        .spyOn(encrypterStub, 'encrypt')
        .mockReturnValueOnce(new Promise((resolve) => resolve(fakeEncrypt)));

      jest
        .spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
        .mockImplementationOnce(() => {
          throw new Error();
        });
      const promise = sut.auth(makeFakeAccount());
      await expect(promise).rejects.toThrow();
    });
  });
});
