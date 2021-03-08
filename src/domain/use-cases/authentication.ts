import { AuthenticationParams, AuthenticationResult } from './../protocols';

export interface Authentication {
  auth(
    authenticationParams: AuthenticationParams,
  ): Promise<AuthenticationResult | null>;
}
