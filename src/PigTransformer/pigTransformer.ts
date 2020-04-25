import InvalidStrategyException from './exceptions/InvalidStrategyException';
import EmptyStrategyException from './exceptions/EmptyStrategyException';
import PigString from './PigString';
import ArrayBasedStrategy from './strategies/ArrayBasedStrategy';
import PigStrategyInterface from './strategies/PigStrategyInterface';
import StringBasedStrategy from './strategies/StringBasedStrategy';

export enum PigStrategies {
  ArrayBased = 'ArrayBased',
  StringBased = 'StringBased',
}

function getStrategy(strategyName: PigStrategies): PigStrategyInterface | undefined {
  if (strategyName === PigStrategies.ArrayBased) {
    return new ArrayBasedStrategy();
  }
  if (strategyName === PigStrategies.StringBased) {
    return new StringBasedStrategy();
  }

  return undefined;
}
export default function transform(str: string, strategy?: PigStrategies): string {
  if (!strategy) {
    throw new EmptyStrategyException();
  }
  if (!Object.values(PigStrategies).includes(strategy)) {
    throw new InvalidStrategyException();
  }

  return String(new PigString(str, getStrategy(strategy)));
}
