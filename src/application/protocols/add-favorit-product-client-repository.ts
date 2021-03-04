export interface AddFavoritProductClientRepository {
  add(clientId: string, productId: string): Promise<boolean>;
}
