export default class EmptyStrategyException extends Error {
  public constructor(message?: string | undefined) {
    super(message ?? 'Empty Strategy');
  }
}
