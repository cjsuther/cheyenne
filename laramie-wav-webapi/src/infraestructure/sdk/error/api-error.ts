export default class ApiError extends Error {

  statusCode: string;

  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}