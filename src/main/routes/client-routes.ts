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
  router.put('/client/:id', adaptRoute(createUpdateClientController()));
  router.delete('/client/:id', adaptRoute(createDeleteClientController()));
  router.get('/client/:id', adaptRoute(createGetClientController()));

  router.post(
    '/client/product',
    adaptRoute(createAddFavoritProductClientController()),
  );
};
