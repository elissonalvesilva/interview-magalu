import { HttpResponse } from './../../../presentation/protocols/http';

export type HttpMethod = 'post' | 'get' | 'put' | 'delete';

export type HttpRequest = {
  url: string;
  method: HttpMethod;
  body?: any;
  headers?: any;
};

export interface HttpClient {
  request: (data: HttpRequest) => Promise<HttpResponse>;
}
