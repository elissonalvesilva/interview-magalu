import { Client } from './../../../domain/protocols/client';
import ClientModel from '../mongodb/models/Clients';

import {
  AddClientRepository,
  AddFavoritProductClientRepository,
  CheckAddedFavoritProductRepository,
  CheckClientByEmailRepository,
  CheckClientByIdRepository,
  DeleteClientRepository,
  GetClientRepository,
  UpdateClientRepository,
} from './../../../application/protocols';

export class ClientMongoRepository
  implements
    AddClientRepository,
    CheckClientByIdRepository,
    CheckClientByEmailRepository,
    GetClientRepository,
    UpdateClientRepository,
    DeleteClientRepository,
    AddFavoritProductClientRepository,
    CheckAddedFavoritProductRepository {
  async addClient(client: Client): Promise<boolean> {
    const resultResponse = await ClientModel.create(client);
    return resultResponse !== null;
  }

  async checkClientById(id: string): Promise<boolean> {
    const client = await ClientModel.findOne({
      _id: id,
    });

    if (client) return true;
    return false;
  }

  async checkClientByEmail(email: string): Promise<boolean> {
    const client = await ClientModel.findOne({
      email,
    });

    return client !== null;
  }

  async getClient(id: string): Promise<Partial<Client>> {
    const client: any = await ClientModel.findOne({
      _id: id,
    });

    return client;
  }

  async updateClient(id: string, client: Client): Promise<boolean> {
    const clientUpdated = await ClientModel.updateOne(
      { _id: id },
      {
        $set: {
          name: client.name,
          email: client.email,
        },
      },
    );

    if (clientUpdated.n > 0) return true;
    return false;
  }

  async deleteClient(id: string): Promise<boolean> {
    const deletedClient = await ClientModel.deleteOne({
      _id: id,
    });

    if (deletedClient.deletedCount && deletedClient.deletedCount > 0) {
      return true;
    }

    return false;
  }

  async addFavorit(clientId: string, productId: string): Promise<boolean> {
    const addedProductInClient = await ClientModel.updateOne(
      {
        _id: clientId,
      },
      {
        $push: {
          favorites: productId,
        },
      },
    );
    return addedProductInClient.nModified > 0 ? true : false;
  }

  async checkProduct(clientId: string, productId: string): Promise<boolean> {
    const client = await ClientModel.findOne({
      _id: clientId,
    });

    if (client && client.favorites) {
      if (client.favorites.indexOf(productId) !== -1) {
        return true;
      }
      return false;
    }
    return false;
  }
}
