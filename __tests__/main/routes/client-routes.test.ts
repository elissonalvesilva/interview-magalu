import { HttpResponse } from 'presentation/protocols';
import { Collection } from 'mongodb';
import request from 'supertest';

import { MongoHelper } from './../../../src/infrastructure/database/mongodb/helpers/mongo-helper';
import app from './../../../src/main/app';
import { badRequest } from './../../../src/presentation/helpers';
import {
  EmailInUseError,
  InvalidParamError,
  MissingParamError,
} from './../../../src/presentation/erros';

let clientCollection: Collection;

describe('Client Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL || '');
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    clientCollection = await MongoHelper.getCollection('clients');
    await clientCollection.deleteMany({});
  });
  describe('POST /client -> Add Client', () => {
    test('should return 200 on create client', async () => {
      await request(app)
        .post('/api/client')
        .send({
          name: 'valid name',
          email: 'mail@mail.com',
        })
        .expect(200);
    });
    test('should return 400 if name is not provided on create client', async () => {
      const response = await request(app)
        .post('/api/client')
        .send({
          email: 'mail@mail.com',
        })
        .expect(400);

      const httpResponse: HttpResponse = badRequest(
        new MissingParamError('name'),
      );
      expect(response.body.error).toBe(httpResponse.body.message);
    });
    test('should return 400 if email is not provided on create client', async () => {
      const response = await request(app)
        .post('/api/client')
        .send({
          name: 'valid name',
        })
        .expect(400);

      const httpResponse: HttpResponse = badRequest(
        new MissingParamError('email'),
      );
      expect(response.body.error).toBe(httpResponse.body.message);
    });
    test('should return 400 if email is not valid on create client', async () => {
      const response = await request(app)
        .post('/api/client')
        .send({
          name: 'valid name',
          email: 'notValidEmail',
        })
        .expect(400);
      const httpResponse: HttpResponse = badRequest(
        new InvalidParamError('email'),
      );
      expect(response.body.error).toBe(httpResponse.body.message);
    });
    test('should return 400 if email is already in use', async () => {
      await clientCollection.insertOne({
        name: 'valid name',
        email: 'mail@mail.com',
      });

      const response = await request(app)
        .post('/api/client')
        .send({
          name: 'valid name',
          email: 'mail@mail.com',
        })
        .expect(400);

      const httpResponse: HttpResponse = badRequest(
        new EmailInUseError('mail@mail.com'),
      );
      expect(response.body.error).toBe(httpResponse.body.message);
    });
  });
});
