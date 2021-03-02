export interface CheckClientByIdRepository {
  checkClientById(id: string): Promise<boolean>;
}
