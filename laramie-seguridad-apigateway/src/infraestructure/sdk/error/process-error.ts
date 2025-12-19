export default class ProcessError extends Error {

  originError: Error;

  constructor(message, originError) {
    super(message);
    this.originError = originError;
    this.name = 'ProcessError';
  }
}