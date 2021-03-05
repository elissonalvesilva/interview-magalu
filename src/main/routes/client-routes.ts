import { Router } from 'express';
import { createAddClientController } from './../../main/factories';

import { adaptRoute } from './../adapters';

export default (router: Router): void => {
  router.post('/client', adaptRoute(createAddClientController()));
};
