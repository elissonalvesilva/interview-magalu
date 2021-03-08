export interface GetAccountByTokenRepositoryResponse {
  id: string;
}

export interface GetAccountByTokenRepository {
  loadByToken(
    token: string,
  ): Promise<GetAccountByTokenRepositoryResponse | null>;
}
