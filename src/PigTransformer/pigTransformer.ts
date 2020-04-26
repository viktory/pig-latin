import InvalidStrategyException from './exceptions/InvalidStrategyException';
import EmptyStrategyException from './exceptions/EmptyStrategyException';
import PigString from './PigString';
import ArrayBasedStrategy from './strategies/ArrayBasedStrategy';
import PigStrategyInterface from './strategies/PigStrategyInterface';
import StringBasedStrategy from './strategies/StringBasedStrategy';
import WordModifierCommand from './commands/WordModifierCommand';
import MixedStrategy from './strategies/MixedStrategy';

export enum PigStrategies {
  ArrayBased = 'ArrayBased',
  StringBased = 'StringBased',
  Mixed = 'Mixed',
}

function getStrategy(strategyName: PigStrategies): PigStrategyInterface | undefined {
  if (strategyName === PigStrategies.ArrayBased) {
    return new ArrayBasedStrategy(new WordModifierCommand());
  }
  if (strategyName === PigStrategies.StringBased) {
    return new StringBasedStrategy();
  }
  if (strategyName === PigStrategies.Mixed) {
    return new MixedStrategy(new WordModifierCommand());
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
