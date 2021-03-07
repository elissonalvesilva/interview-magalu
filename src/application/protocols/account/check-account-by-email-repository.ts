export interface CheckAccountByEmailRepository {
  checkAccountByEmail(email: string): Promise<boolean>;
}
