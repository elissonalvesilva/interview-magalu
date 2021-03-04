export interface CheckAddedFavoritProductRepository {
  checkProduct(productId: string): Promise<boolean>;
}
