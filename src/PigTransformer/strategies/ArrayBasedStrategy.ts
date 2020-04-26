import PigStrategyInterface from './PigStrategyInterface';
import InvalidWordsDelimitersCounts from '../exceptions/InvalidWordsDelimitersCounts';
import { delimiterRegExp, getDelimiters } from '../utils';
import { WordModifierCommandInterface } from '../commands/WordModifierCommand';

export default class ArrayBasedStrategy implements PigStrategyInterface {
  private modifyCommand: WordModifierCommandInterface;

  public constructor(modifyCommand: WordModifierCommandInterface) {
    this.modifyCommand = modifyCommand;
  }

  public transform(origin: string): string {
    const delimiters = getDelimiters(origin);
    const words = this.simplifyDelimiters(origin).split(' ').map((word: string) => this.modify(word));

    return this.concat(words, delimiters);
  }

  private modify(word: string): string {
    return this.modifyCommand.modify(word);
  }

  private simplifyDelimiters(str: string): string {
    return str.replace(delimiterRegExp, ' ');
  }

  private concat(words: string[], delimiters: string[]): string {
    if (words.length - delimiters.length > 1) {
      throw new InvalidWordsDelimitersCounts('InvalidWordsDelimitersCounts: too many words');
    }
    if (words.length - delimiters.length < 0) {
      throw new InvalidWordsDelimitersCounts('InvalidWordsDelimitersCounts: too many delimiters');
    }

    let str = '';
    while (words.length > 0) {
      str += words.shift() + (delimiters.shift() ?? '');
    }

    return str;
  }
}
