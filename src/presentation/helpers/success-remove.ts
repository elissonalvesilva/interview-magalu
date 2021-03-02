interface SuccessRemoveResponse {
  statusCode: number;
  itemRemoved: string;
}

export function SuccessRemove(itemRemoved: string): SuccessRemoveResponse {
  return {
    statusCode: 200,
    itemRemoved,
  };
}
