export class MpesaError extends Error {
  code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "MpesaError";
    this.code = code;
  }
}
