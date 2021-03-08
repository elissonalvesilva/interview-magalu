import { DbGetAccountByToken } from './../../../src/application/use-cases/db-get-account-by-token';
import {
  GetAccountByTokenRepository,
  GetAccountByTokenRepositoryResponse,
} from './../../../src/application/protocols/account/get-account-by-token-repository';
import { CriptograpyDecrypter } from './../../../src/application/protocols/criptography/criptography-decrypt';
import faker from 'faker';

const fakeDecryptedString = 'fake_decrypted';
const fakeId = 'valid_id';
const makeDecrypter = (): CriptograpyDecrypter => {
  class CriptograpyDecrypterStub implements CriptograpyDecrypter {
    decrypt(ciphertext: string): Promise<string> {
      return new Promise((resolve) => resolve(fakeDecryptedString));
    }
  }
  return new CriptograpyDecrypterStub();
};

const makeGetAccountByTokenRepository = (): GetAccountByTokenRepository => {
  class GetAccountByTokenRepositoryStub implements GetAccountByTokenRepository {
    loadByToken(
      token: string,
    ): Promise<GetAccountByTokenRepositoryResponse | null> {
      return new Promise((resolve) => resolve({ id: fakeId }));
    }
  }
  return new GetAccountByTokenRepositoryStub();
};

type SutTypes = {
  sut: DbGetAccountByToken;
  decrypterStub: CriptograpyDecrypter;
  getAccountByTokenRepositoryStub: GetAccountByTokenRepository;
};

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter();
  const getAccountByTokenRepositoryStub = makeGetAccountByTokenRepository();
  const sut = new DbGetAccountByToken(
    decrypterStub,
    getAccountByTokenRepositoryStub,
  );
  return {
    sut,
    decrypterStub,
    getAccountByTokenRepositoryStub,
  };
};

let token: string;
let role: string;

describe('DbLoadAccountByToken Usecase', () => {
  beforeEach(() => {
    token = faker.random.uuid();
  });

  describe('CriptographyDecrypter', () => {
    test('Should call CriptographyDecrypter with correct ciphertext', async () => {
      const { sut, decrypterStub } = makeSut();

      const decrypterSpy = jest.spyOn(decrypterStub, 'decrypt');

      await sut.load(token);
      expect(decrypterSpy).toHaveBeenCalledWith(token);
    });

    test('Should return null if CriptographyDecrypter returns null', async () => {
      const { sut, decrypterStub } = makeSut();
      jest
        .spyOn(decrypterStub, 'decrypt')
        .mockReturnValueOnce(new Promise((resolve) => resolve('')));
      const account = await sut.load(token);
      expect(account).toBeNull();
    });

    test('Should throw if CriptographyDecrypter throws', async () => {
      const { sut, decrypterStub } = makeSut();
      jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(() => {
        throw new Error();
      });
      const account = await sut.load(token);
      await expect(account).toBeNull();
    });
  });

  describe('GetAccountByTokenRepository', () => {
    test('Should call GetAccountByTokenRepository with correct values', async () => {
      const { sut, decrypterStub, getAccountByTokenRepositoryStub } = makeSut();
      jest
        .spyOn(decrypterStub, 'decrypt')
        .mockReturnValueOnce(
          new Promise((resolve) => resolve(fakeDecryptedString)),
        );

      const getAccountByTokenRepositorySpy = jest.spyOn(
        getAccountByTokenRepositoryStub,
        'loadByToken',
      );

      await sut.load(token);
      expect(getAccountByTokenRepositorySpy).toHaveBeenCalledWith(token);
    });

    test('Should return null if GetAccountByTokenRepository returns null', async () => {
      const { sut, decrypterStub, getAccountByTokenRepositoryStub } = makeSut();
      jest
        .spyOn(decrypterStub, 'decrypt')
        .mockReturnValueOnce(
          new Promise((resolve) => resolve(fakeDecryptedString)),
        );

      jest
        .spyOn(getAccountByTokenRepositoryStub, 'loadByToken')
        .mockReturnValueOnce(new Promise((resolve) => resolve(null)));
      const account = await sut.load(token);
      expect(account).toBeNull();
    });

    test('Should throw if GetAccountByTokenRepository throws', async () => {
      const { sut, getAccountByTokenRepositoryStub } = makeSut();
      jest
        .spyOn(getAccountByTokenRepositoryStub, 'loadByToken')
        .mockImplementationOnce(() => {
          throw new Error();
        });
      const promise = sut.load(token);
      await expect(promise).rejects.toThrow();
    });
  });

  test('Should return an account on success', async () => {
    const { sut, decrypterStub } = makeSut();
    jest
      .spyOn(decrypterStub, 'decrypt')
      .mockReturnValueOnce(
        new Promise((resolve) => resolve(fakeDecryptedString)),
      );

    const account = await sut.load(token);
    expect(account).toEqual({ id: fakeId });
  });
});
