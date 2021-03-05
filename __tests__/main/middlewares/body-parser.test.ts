import app from './../../../src/main/app';

import request from 'supertest';

describe('Body Parser Middleware', () => {
  test('Should parse body as json', async () => {
    app.post('/body_parser_test', (req, res) => {
      res.send(req.body);
    });
    await request(app)
      .post('/body_parser_test')
      .send({ name: 'Magalu' })
      .expect({ name: 'Magalu' });
  });
});
