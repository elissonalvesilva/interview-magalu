export interface DeleteClientRepository {
  deleteClient(id: string): Promise<boolean>;
}
