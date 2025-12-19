export default class ValidationError extends Error {

  code: string;

  constructor(message, code = "") {
    super(message);
    this.code = code;
    this.name = 'ValidationError';
  }
}