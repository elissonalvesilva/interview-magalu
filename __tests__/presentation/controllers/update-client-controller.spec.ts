import { MissingParamError } from './../../../src/presentation/erros';
import { badRequest } from './../../../src/presentation/helpers/http-helpers';
import { UpdateClientController } from './../../../src/presentation/controllers/update-client-controller';

interface SutTypes {
  sut: UpdateClientController;
}

const makeSut = (): SutTypes => {
  const sut = new UpdateClientController();
  return { sut };
};

describe('Update Client Controller', () => {
  test('should return erro if id is not provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      name: 'Elisson',
      email: 'mail@mail.com',
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('id')));
  });
  test('should return erro if name is not provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      id: 'valid_id',
      email: 'mail@mail.com',
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')));
  });

  test('should return erro if email is not provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      id: 'valid_id',
      name: 'Elisson',
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });
});
