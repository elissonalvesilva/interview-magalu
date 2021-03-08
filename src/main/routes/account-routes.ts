import { Router } from 'express';
import { adaptRoute } from './../adapters';
import { createSignUpController } from './../factories/account/signup-controller-factory';
import { createLoginController } from './../factories/account/login-controller-factory';

export default (router: Router): void => {
  router.post('/account/signup', adaptRoute(createSignUpController()));
  router.post('/account/login', adaptRoute(createLoginController()));
};
