import { HttpResponse } from './../../presentation/protocols/http';

export interface ProductServiceRepository {
  getProduct(id: string): Promise<HttpResponse>;
}
