export interface CheckAddedFavoritProductRepository {
  checkProduct(clientId: string, productId: string): Promise<boolean>;
}
