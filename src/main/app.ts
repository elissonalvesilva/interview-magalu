import express from 'express';

import applyMiddlewares from './setup/middlewares';

const app = express();

applyMiddlewares(app);

export default app;
