export class NotFoundParamError extends Error {
  constructor(paramName: string) {
    super(`Not found param ${paramName}`);
    this.name = 'NotFoundParamError';
  }
}
