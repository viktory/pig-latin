import PigStrategyInterface from './strategies/PigStrategyInterface';

interface PigStringInterface {
  setStrategy: (pigStrategy: PigStrategyInterface) => void;
  toString: () => string;
  transformed: string;
}

export default class PigString implements PigStringInterface {
  private strategy: PigStrategyInterface;

  private readonly origin: string;

  private _transformed?: string;

  constructor(originString: string, pigStrategy: PigStrategyInterface) {
    this.origin = originString;
    this.strategy = pigStrategy;
  }

  public setStrategy(pigStrategy: PigStrategyInterface): void {
    this.strategy = pigStrategy;
  }

  public get transformed(): string {
    if (!this._transformed) {
      this._transformed = this.strategy.transform(this.origin);
    }

    return this._transformed;
  }

  public toString(): string {
    return this.transformed;
  }
}
