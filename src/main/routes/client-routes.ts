import { Router } from 'express';
import { createUpdateClientController } from './../../main/factories/update-client-controller-factory';
import { createAddClientController } from './../../main/factories';

import { adaptRoute } from './../adapters';

export default (router: Router): void => {
  router.post('/client', adaptRoute(createAddClientController()));
  router.put('/client', adaptRoute(createUpdateClientController()));
};
