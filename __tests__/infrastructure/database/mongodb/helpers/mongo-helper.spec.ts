import { MongoHelper as sut } from '../../../../../src/infrastructure/database/mongodb/helpers';

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL || '');
  });

  afterAll(async () => {
    await sut.disconnect();
  });

  test('Should reconnect if mongodb is down', async () => {
    let accountCollection = await sut.getCollection('clients');
    expect(accountCollection).toBeTruthy();
    await sut.disconnect();
    accountCollection = await sut.getCollection('clients');
    expect(accountCollection).toBeTruthy();
  });
});
