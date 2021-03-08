export interface GetAccountByTokenResult {
  id: string;
}
export interface GetAccountByToken {
  load(
    accessToken: string,
    role?: string,
  ): Promise<GetAccountByTokenResult | null>;
}
