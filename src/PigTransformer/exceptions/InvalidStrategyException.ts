export default class InvalidStrategyException extends Error {
  public constructor(message?: string | undefined) {
    super(message ?? 'Invalid Strategy');
  }
}
