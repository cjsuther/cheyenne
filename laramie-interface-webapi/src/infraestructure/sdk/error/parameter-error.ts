export default class ParameterError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ParameterError';
  }
}