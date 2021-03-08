import { auth } from './../middlewares/auth';
import { Router } from 'express';
import { adaptRoute } from './../adapters';

import {
  createUpdateClientController,
  createAddClientController,
  createDeleteClientController,
  createAddFavoritProductClientController,
  createGetClientController,
} from './../../main/factories';

export default (router: Router): void => {
  router.post('/client', auth, adaptRoute(createAddClientController()));
  router.put('/client/:id', auth, adaptRoute(createUpdateClientController()));
  router.delete(
    '/client/:id',
    auth,
    adaptRoute(createDeleteClientController()),
  );
  router.get('/client/:id', auth, adaptRoute(createGetClientController()));

  router.post(
    '/client/product',
    auth,
    adaptRoute(createAddFavoritProductClientController()),
  );
};
