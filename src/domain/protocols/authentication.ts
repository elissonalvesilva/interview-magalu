export interface AuthenticationParams {
  email: string;
  password: string;
}

export interface AuthenticationResult {
  accessToken: string;
  name: string;
}
