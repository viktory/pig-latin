import PigStrategyInterface from './PigStrategyInterface';
import {
  convertCharInCorrectCase,
  endsWith,
  hasDelimiter,
  hasSpecialCharactersOnly,
  isCharacterConsonant,
  isCharacterVowel
} from '../utils';
import {
  CONSONANT_POSTFIX, CONSONANT_PREFIX, STOP_MODIFYING_POSTFIXES, VOWEL_POSTFIX, VOWEL_PREFIX
} from '../config';

// todo should be refactored, object's state must be reset each time transform is called
export default class StringBasedStrategy implements PigStrategyInterface {
  public transform(origin: string): string {
    this.result = '';
    this.resetWordData();

    let i = 0;
    let current: string | undefined;
    do {
      current = origin[i];
      this.preProcessCurrentChar(origin, i);

      if (
        !!origin[i]
        && (!hasSpecialCharactersOnly(origin[i])
        || hasDelimiter(origin[i])) && !this.isCurrentFirstConsonant
      ) {
        this.processCurrentChar(origin, i, this.previousLetter);
      }

      this.postProcessCurrentChar(origin, i);

      i += 1;
    } while (current);

    return this.result;
  }

  private result = '';

  private firstCharInCurrentWord = '';

  private newWordIndex?: number;

  private previousLetter = '';

  private isCurrentFirstConsonant = false;

  private preProcessCurrentChar(origin: string, index: number): void {
    switch (true) {
      case this.isDelimiterOrEmpty(origin[index]):
        this.preProcessAsDelimiter(origin, index);
        break;
      case !hasSpecialCharactersOnly(origin[index]):
        this.preProcessAsLetter(origin[index], origin[index - 1]);

        break;
      default:
      // nothing if current char is specialChar
    }
  }

  private preProcessAsDelimiter(origin: string, currentOriginIndex: number): void {
    if (endsWith(this.result, STOP_MODIFYING_POSTFIXES)) {
      if (this.isConsonantWord()) {
        // return back first consonant and fix case
        this.revertCase();
      }
    } else if (!!origin[currentOriginIndex - 1] && !this.isDelimiterOrEmpty(origin[currentOriginIndex - 1])) {
      this.result += this.firstCharInCurrentWord + (this.firstCharInCurrentWord ? CONSONANT_POSTFIX : VOWEL_POSTFIX);
    }

    this.resetWordData();
    this.putSpecialChars(origin, currentOriginIndex);
  }

  private preProcessAsLetter(char: string, previousChar: string): void {
    if (this.isFirstLetter(previousChar)) {
      this.processFirstLetter(char);
    }
  }

  private processCurrentChar(origin: string, index: number, previousLetterChar: string): void {
    this.result += this.isConsonantWord() && previousLetterChar
      ? convertCharInCorrectCase(origin[index], previousLetterChar)
      : origin[index];
  }

  private processFirstLetter(char: string): void {
    let prefix = '';
    if (isCharacterConsonant(char)) {
      this.firstCharInCurrentWord = char.toLowerCase();
      this.newWordIndex = this.result.length;
      prefix = CONSONANT_PREFIX;
      this.isCurrentFirstConsonant = true;
    } else if (isCharacterVowel(char)) {
      prefix = VOWEL_PREFIX;
    }

    this.result += prefix;
  }

  private postProcessCurrentChar(origin: string, index: number): void {
    switch (true) {
      case (!!origin[index] && !hasSpecialCharactersOnly(origin[index]) && !this.isDelimiterOrEmpty(origin[index])):
        this.previousLetter = origin[index];
        break;
      default:
      // nothing if current char is specialChar
    }

    this.isCurrentFirstConsonant = false;
  }

  private isFirstLetter(previousChar: string): boolean {
    return !previousChar || hasDelimiter(previousChar);
  }

  private isDelimiterOrEmpty(char: string | undefined): boolean {
    return !char || hasDelimiter(char);
  }

  private isConsonantWord(): boolean {
    return !!this.firstCharInCurrentWord;
  }

  private revertCase(): void {
    this.result = this.result.substr(0, this.newWordIndex)
      + convertCharInCorrectCase(this.firstCharInCurrentWord, this.result[this.newWordIndex])
      + this.reverseSubString();
  }

  private reverseSubString(): string {
    let subResult = '';
    for (let k = this.newWordIndex; k < this.result.length - 1; k += 1) {
      subResult += convertCharInCorrectCase(this.result[k], this.result[k + 1]);
    }

    return subResult + this.result.slice(-1);
  }

  private resetWordData(): void {
    this.newWordIndex = undefined;
    this.firstCharInCurrentWord = '';
    this.previousLetter = '';
  }

  private putSpecialChars(origin: string, currentOriginIndex: number): void {
    let reverseOriginIndex = currentOriginIndex - 1;
    let resultIndex: number;

    while (origin[reverseOriginIndex] && !this.isDelimiterOrEmpty(origin[reverseOriginIndex])) {
      if (hasSpecialCharactersOnly(origin[reverseOriginIndex])) {
        resultIndex = this.result.length - (currentOriginIndex - reverseOriginIndex) + 1;
        this.result = this.result.substr(0, resultIndex) + origin[reverseOriginIndex] + this.result.substr(resultIndex);
      }
      reverseOriginIndex -= 1;
    }
  }
}
