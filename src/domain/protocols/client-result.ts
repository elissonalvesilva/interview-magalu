import { Product } from './product';

export interface ClientResult {
  name: string;
  email: string;
  favorites?: Product[];
}
