import PigStrategyInterface from './PigStrategyInterface';

export default class StringBasedStrategy implements PigStrategyInterface {
  public transform(origin: string): string {
    return origin;
  }
}
