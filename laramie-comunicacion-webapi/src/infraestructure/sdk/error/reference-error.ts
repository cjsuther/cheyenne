export default class ReferenceError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ReferenceError';
  }
}