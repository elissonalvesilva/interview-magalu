import { Router } from 'express';
import { createSignUpController } from './../factories/account/signup-controller-factory';
import { adaptRoute } from './../adapters';

export default (router: Router): void => {
  router.post('/account/signup', adaptRoute(createSignUpController()));
};
