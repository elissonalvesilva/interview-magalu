export interface AddFavoritProductClientRepository {
  addFavorit(clientId: string, productId: string): Promise<boolean>;
}
