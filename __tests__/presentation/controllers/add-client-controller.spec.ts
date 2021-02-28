import { MissingParamError } from '../../../src/presentation/erros';
import { badRequest } from '../../../src/presentation/helpers/http-helpers';
import { AddClientController } from './../../../src/presentation/controllers/add-client-controller';

interface ControllerStub {
  sut: AddClientController;
}

const makeStub = (): ControllerStub => {
  const sut = new AddClientController();
  return {
    sut,
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
});
