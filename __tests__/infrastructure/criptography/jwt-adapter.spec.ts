import { JwtAdapter } from './../../../src/infrastructure/criptography/jwt-adapter';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return 'some_token';
  },

  async verify(): Promise<string> {
    return 'some_value';
  },
}));

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret');
};

describe('Jwt Adapter', () => {
  describe('sign method', () => {
    test('should call sign with correct values', async () => {
      const sut = makeSut();
      const signSpy = jest.spyOn(jwt, 'sign');
      await sut.encrypt('some_id');
      expect(signSpy).toHaveBeenCalledWith({ id: 'some_id' }, 'secret');
    });

    test('should return a token on sign success', async () => {
      const sut = makeSut();
      const accessToken = await sut.encrypt('some_id');
      expect(accessToken).toBe('some_token');
    });

    test('should throw if sign throws', async () => {
      const sut = makeSut();
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error();
      });
      const promise = sut.encrypt('some_id');
      await expect(promise).rejects.toThrow();
    });
  });

  describe('verify method', () => {
    test('should call verify with correct values', async () => {
      const sut = makeSut();
      const verifySpy = jest.spyOn(jwt, 'verify');
      await sut.decrypt('some_token');
      expect(verifySpy).toHaveBeenCalledWith('some_token', 'secret');
    });

    test('should return a value on verify success', async () => {
      const sut = makeSut();
      const value = await sut.decrypt('some_token');
      expect(value).toBe('some_value');
    });

    test('should throw if verify throws', async () => {
      const sut = makeSut();
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
        throw new Error();
      });
      const promise = sut.decrypt('some_token');
      await expect(promise).rejects.toThrow();
    });
  });
});
