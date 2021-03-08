import request from 'supertest';

import app from './../../../src/main/app';

import { MongoHelper } from './../../../src/infrastructure/database/mongodb/helpers/mongoose-helper';
import AccountModel from './../../../src/infrastructure/database/mongodb/models/Account';

describe('Account Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL || '');
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    await AccountModel.deleteMany({});
  });
  describe('POST /account/signup', () => {
    test('should return 200 on signup', async () => {
      await request(app)
        .post('/api/account/signup')
        .send({
          name: 'Elisson Silva',
          email: 'elisson.silva@mail.com',
          password: '123456',
          passwordConfirmation: '123456',
        })
        .expect(200);

      await request(app)
        .post('/api/account/signup')
        .send({
          name: 'Elisson Silva',
          email: 'elisson.silva@mail.com',
          password: '123456',
          passwordConfirmation: '123456',
        })
        .expect(403);
    });
  });
});
