import mongoose from 'mongoose';

export class MongoHelper {
  static connect(uri: string): Promise<void> {
    const connection = () => {
      mongoose
        .connect(encodeURI(uri), {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
        })
        .then(() => {
          return console.log(`Successfully connected to ${uri}`);
        })
        .catch((error) => {
          console.log('Error connecting to database: ', error);
          return process.exit(1);
        });
    };
    return new Promise((resolve) => resolve(connection()));
  }

  static disconnect(): void {
    mongoose.connection.close();
  }
}
