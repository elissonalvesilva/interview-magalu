import { Product } from './product';

export interface ClientResult {
  _id?: string;
  name: string;
  email: string;
  favorites?: Product[];
}
