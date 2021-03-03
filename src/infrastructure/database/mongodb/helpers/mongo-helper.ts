import { MongoClient, Collection } from 'mongodb';

export class MongoHelper {
  public static client: MongoClient;
  public static uri: string;

  static connect(uri: string): Promise<any> {
    this.uri = uri;
    return new Promise<any>((resolve, reject) => {
      MongoClient.connect(
        uri,
        { useNewUrlParser: true, useUnifiedTopology: true },
        (err, client: MongoClient) => {
          if (err) {
            reject(err);
          } else {
            MongoHelper.client = client;
            resolve(client);
          }
        },
      );
    });
  }

  static async getCollection(name: string): Promise<Collection> {
    if (!this.client?.isConnected()) {
      await MongoHelper.connect(this.uri);
    }
    return this.client.db().collection(name);
  }

  static disconnect(): void {
    MongoHelper.client.close();
  }

  static map(data: any): any {
    const { _id, ...rest } = data;
    return { ...rest, id: _id };
  }
  static mapCollection(collection: any[]): any[] {
    return collection.map((c) => MongoHelper.map(c));
  }
}
