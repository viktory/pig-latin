import PigStrategyInterface from './PigStrategyInterface';
import { hasDelimiter } from '../utils';
import { WordModifierCommandInterface } from '../commands/WordModifierCommand';

export default class MixedStrategy implements PigStrategyInterface {
  private modifyCommand: WordModifierCommandInterface;

  public constructor(modifyCommand: WordModifierCommandInterface) {
    this.modifyCommand = modifyCommand;
  }

  public transform(origin: string): string {
    let word = '';
    let result = '';

    for (let i = 0; i < origin.length; i += 1) {
      if (hasDelimiter(origin[i])) {
        if (word.length > 0) {
          result += this.modify(word);
        }
        result += origin[i];
        word = '';
      } else {
        word += origin[i];
      }
    }

    return result + this.modify(word);
  }

  private modify(word: string): string {
    return this.modifyCommand.modify(word);
  }
}
