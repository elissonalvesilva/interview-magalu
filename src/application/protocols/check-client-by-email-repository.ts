export interface CheckClientByEmailRepository {
  checkClientByEmail(email: string): Promise<boolean>;
}
