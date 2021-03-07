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
  router.post('/client', adaptRoute(createAddClientController()));
  router.put('/client', adaptRoute(createUpdateClientController()));
  router.delete('/client', adaptRoute(createDeleteClientController()));
  router.get('/client', adaptRoute(createGetClientController()));

  router.post(
    '/client/product',
    adaptRoute(createAddFavoritProductClientController()),
  );
};
