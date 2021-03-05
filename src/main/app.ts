import express from 'express';

import applyMiddlewares from './setup/middlewares';
import routes from './setup/routes';

const app = express();

applyMiddlewares(app);
routes(app);
export default app;
