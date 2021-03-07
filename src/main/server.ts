import dotenv from 'dotenv';
import { MongoHelper } from './../infrastructure/database/mongodb/helpers/mongoose-helper';

dotenv.config();

MongoHelper.connect(process.env.MONGO_URL || '')
  .then(async () => {
    const app = (await import('./app')).default;
    app.listen(process.env.PORT, () =>
      console.log(
        `Wishilist API running at http://localhost:${process.env.PORT}`,
      ),
    );
  })
  .catch(console.error);
