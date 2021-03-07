import request from 'supertest';
import { HttpResponse } from './../../../src/presentation/protocols';

import { MongoHelper } from './../../../src/infrastructure/database/mongodb/helpers/mongoose-helper';
import app from './../../../src/main/app';
import { badRequest, notFound } from './../../../src/presentation/helpers';
import {
  EmailInUseError,
  InvalidParamError,
  MissingParamError,
  NotFoundParamError,
} from './../../../src/presentation/erros';
import ClientModel from './../../../src/infrastructure/database/mongodb/models/Clients';

describe('Client Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL || '');
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    await ClientModel.deleteMany({});
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
      await ClientModel.create({
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

  // describe('PUT /client -> Update Client', () => {
  //   test('should update client', async () => {
  //     const client = await clientCollection.insertOne({
  //       name: 'valid name',
  //       email: 'mail@mail.com',
  //     });
  //     const clientId = client.ops[0]._id;

  //     await request(app)
  //       .put('/api/client')
  //       .send({
  //         id: clientId,
  //         name: 'valid name',
  //         email: 'mail@mail.com',
  //       })
  //       .expect(200);
  //   });

  //   test('should return 400 if id is not provided on create client', async () => {
  //     const response = await request(app)
  //       .put('/api/client')
  //       .send({
  //         name: 'valid name',
  //         email: 'mail@mail.com',
  //       })
  //       .expect(400);

  //     const httpResponse: HttpResponse = badRequest(
  //       new MissingParamError('id'),
  //     );
  //     expect(response.body.error).toBe(httpResponse.body.message);
  //   });

  //   test('should return 400 if name is not provided on create client', async () => {
  //     const response = await request(app)
  //       .put('/api/client')
  //       .send({
  //         id: 'valid_id',
  //         email: 'mail@mail.com',
  //       })
  //       .expect(400);

  //     const httpResponse: HttpResponse = badRequest(
  //       new MissingParamError('name'),
  //     );
  //     expect(response.body.error).toBe(httpResponse.body.message);
  //   });
  //   test('should return 400 if email is not provided on create client', async () => {
  //     const response = await request(app)
  //       .put('/api/client')
  //       .send({
  //         id: 'valid_id',
  //         name: 'valid name',
  //       })
  //       .expect(400);

  //     const httpResponse: HttpResponse = badRequest(
  //       new MissingParamError('email'),
  //     );
  //     expect(response.body.error).toBe(httpResponse.body.message);
  //   });
  //   test('should return 404 if id not found', async () => {
  //     await clientCollection.insertOne({
  //       name: 'valid name',
  //       email: 'mail@mail.com',
  //     });

  //     const response = await request(app)
  //       .put('/api/client')
  //       .send({
  //         id: '604198f3d1f52339643d2367',
  //         name: 'valid name',
  //         email: 'mail@mail.com',
  //       })
  //       .expect(404);

  //     const httpResponse: HttpResponse = notFound(
  //       new NotFoundParamError('604198f3d1f52339643d2367'),
  //     );
  //     expect(response.body.error).toBe(httpResponse.body.message);
  //   });
  // });
});
