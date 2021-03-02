export interface DeleteClient {
  delete(id: string): Promise<boolean>;
}
