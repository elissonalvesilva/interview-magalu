import axios from 'axios';
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

  describe('PUT /client -> Update Client', () => {
    test('should update client', async () => {
      const client = await ClientModel.create({
        name: 'valid name',
        email: 'mail@mail.com',
      });
      const clientId = client._id;

      await request(app)
        .put(`/api/client/${clientId}`)
        .send({
          name: 'valid name',
          email: 'mail@mail.com',
        })
        .expect(200);
    });

    test('should return 400 if id is not provided on update client', async () => {
      const response = await request(app)
        .put(`/api/client`)
        .send({
          name: 'valid name',
          email: 'mail@mail.com',
        })
        .expect(404);
      expect(response.body.error).toBeUndefined();
    });

    test('should return 400 if name is not provided on update client', async () => {
      const response = await request(app)
        .put('/api/client/604198f3d1f52339643d2367')
        .send({
          email: 'mail@mail.com',
        })
        .expect(400);

      const httpResponse: HttpResponse = badRequest(
        new MissingParamError('name'),
      );
      expect(response.body.error).toBe(httpResponse.body.message);
    });
    test('should return 400 if email is not provided on update client', async () => {
      const response = await request(app)
        .put('/api/client/604198f3d1f52339643d2367')
        .send({
          name: 'valid name',
        })
        .expect(400);

      const httpResponse: HttpResponse = badRequest(
        new MissingParamError('email'),
      );
      expect(response.body.error).toBe(httpResponse.body.message);
    });
    test('should return 404 if id not found', async () => {
      await ClientModel.create({
        name: 'valid name',
        email: 'mail@mail.com',
      });

      const response = await request(app)
        .put('/api/client/604198f3d1f52339643d2367')
        .send({
          name: 'valid name',
          email: 'mail@mail.com',
        })
        .expect(404);

      const httpResponse: HttpResponse = notFound(
        new NotFoundParamError('604198f3d1f52339643d2367'),
      );
      expect(response.body.error).toBe(httpResponse.body.message);
    });
  });

  describe('DELETE /client -> Delete Client', () => {
    test('should delete client', async () => {
      const client = await ClientModel.create({
        name: 'valid name',
        email: 'mail@mail.com',
      });
      const clientId = client._id;

      await request(app).delete(`/api/client/${clientId}`).send({}).expect(200);
    });

    test('should return 400 if id is not provided on delete client', async () => {
      const response = await request(app)
        .delete('/api/client/')
        .send({})
        .expect(404);

      expect(response.body.error).toBeUndefined();
    });

    test('should return 404 if id not found', async () => {
      await ClientModel.create({
        name: 'valid name',
        email: 'mail@mail.com',
      });

      const response = await request(app)
        .delete('/api/client/604198f3d1f52339643d2367')
        .send({})
        .expect(404);

      const httpResponse: HttpResponse = notFound(
        new NotFoundParamError('604198f3d1f52339643d2367'),
      );
      expect(response.body.error).toBe(httpResponse.body.message);
    });
  });

  describe('POST /client/product -> Add Favorit', () => {
    test('should add product in client', async () => {
      const { data } = await axios.get(`${process.env.API_PRODUCT}/?page=1`);
      const productid = data.products[0].id;
      const client = await ClientModel.create({
        name: 'valid name',
        email: 'mail@mail.com',
      });
      const clientId = client._id;

      await request(app)
        .post('/api/client/product')
        .send({
          clientid: clientId,
          productid,
        })
        .expect(200);
    });

    test('should return 400 if clientid is not provided on add product in favorit list', async () => {
      const response = await request(app)
        .post('/api/client/product')
        .send({
          productid: 'valid_productid',
        })
        .expect(400);

      const httpResponse: HttpResponse = badRequest(
        new MissingParamError('clientid'),
      );
      expect(response.body.error).toBe(httpResponse.body.message);
    });
    test('should return 400 if productid is not provided on add product in favorit list', async () => {
      const client = await ClientModel.create({
        name: 'valid name',
        email: 'mail@mail.com',
      });
      const clientId = client._id;
      const response = await request(app)
        .post('/api/client/product')
        .send({
          clientid: clientId,
        })
        .expect(400);

      const httpResponse: HttpResponse = badRequest(
        new MissingParamError('productid'),
      );
      expect(response.body.error).toBe(httpResponse.body.message);
    });
  });

  describe('GET /client -> Get Client', () => {
    test('should return a client', async () => {
      const client = await ClientModel.create({
        name: 'valid name',
        email: 'mail@mail.com',
      });
      const clientId = client._id;

      const { data } = await axios.get(`${process.env.API_PRODUCT}/?page=1`);
      const productid1 = data.products[0].id;
      const productid2 = data.products[1].id;

      await request(app)
        .post('/api/client/product')
        .send({
          clientid: clientId,
          productid: productid1,
        })
        .expect(200);
      await request(app)
        .post('/api/client/product')
        .send({
          clientid: clientId,
          productid: productid2,
        })
        .expect(200);

      await request(app).get(`/api/client/${clientId}`).send().expect(200);
    });

    test('should return 400 if id is not provided on get client', async () => {
      const response = await request(app)
        .get('/api/client/')
        .send({})
        .expect(404);

      expect(response.body.error).toBeUndefined();
    });
  });
});
