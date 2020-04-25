import PigStrategyInterface from './PigStrategyInterface';
import {
  CONSONANT_LETTERS, CONSONANT_POSTFIX, CONSONANT_PREFIX, CONSONANT_VOWEL_LETTERS,
  STOP_MODIFYING_POSTFIXES,
  STOP_MODIFYING_PREFIXES,
  VOWEL_LETTERS, VOWEL_POSTFIX, VOWEL_PREFIX,
  WORD_SEPARATORS
} from '../config';
import InvalidWordsDelimitersCounts from '../exceptions/InvalidWordsDelimitersCounts';

export default class ArrayBasedStrategy implements PigStrategyInterface {
  private readonly delimiterRegExp: RegExp;

  private readonly specialCharactersRegExp: RegExp;

  public constructor() {
    this.delimiterRegExp = RegExp(`[${WORD_SEPARATORS.join('|')}]{1,}`, 'g');
    this.specialCharactersRegExp = RegExp(
      `[^${CONSONANT_LETTERS.join('')}${VOWEL_LETTERS.join('')}${CONSONANT_VOWEL_LETTERS.join('')}]`,
      'g'
    );
  }

  public transform(origin: string): string {
    const delimiters = this.findDelimiters(origin);
    const words = this.simplifyDelimiters(origin).split(' ').map((word: string) => this.modify(word));

    return this.concat(words, delimiters);
  }

  private modify(word: string): string {
    let wordsWithoutSpecialChars = word.toLowerCase().replace(this.specialCharactersRegExp, '');

    if (
      (wordsWithoutSpecialChars.length === 0)
      || this.endsWith(wordsWithoutSpecialChars, STOP_MODIFYING_POSTFIXES)
      || this.beginsWith(wordsWithoutSpecialChars, STOP_MODIFYING_PREFIXES)
    ) {
      return word;
    }

    wordsWithoutSpecialChars = this.isCharacterConsonant(wordsWithoutSpecialChars[0])
      ? this.modifyAsConsonant(wordsWithoutSpecialChars)
      : this.modifyAsVowel(wordsWithoutSpecialChars);

    return this.putSpecialCharacters(word, this.capitalize(word, wordsWithoutSpecialChars));
  }

  private capitalize(origin: string, result: string): string {
    const resultArray = result.split('');

    origin.split('').forEach((char: string, index: number) => {
      if (char !== char.toLowerCase()) {
        resultArray[index] = resultArray[index].toUpperCase();
      }
    });

    return resultArray.join('');
  }

  private putSpecialCharacters(origin: string, resultWithoutSpecialCharacters: string): string {
    const originArray = origin.split('');
    let result = resultWithoutSpecialCharacters;
    for (let i = originArray.length - 1, positionFromEnd = 0; i >= 0; i -= 1, positionFromEnd += 1) {
      if (originArray[i].toLowerCase().match(this.specialCharactersRegExp)) {
        result = [
          result.substr(0, result.length - positionFromEnd),
          originArray[i],
          result.substr(result.length - positionFromEnd)
        ].join('');
      }
    }

    return result;
  }

  private modifyAsConsonant(str): string {
    return `${CONSONANT_PREFIX}${str.substr(1) + str.substr(0, 1)}${CONSONANT_POSTFIX}`;
  }

  private modifyAsVowel(str): string {
    return `${VOWEL_PREFIX}${str}${VOWEL_POSTFIX}`;
  }

  private isCharacterConsonant(char: string): boolean {
    return (CONSONANT_LETTERS.indexOf(char) > -1)
      || ((CONSONANT_VOWEL_LETTERS.indexOf(char) > -1) && (this.isConsonantVowelConsonant(char)));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private isConsonantVowelConsonant(char: string): boolean {
    // todo assume Y is always consonant at the beginning of the word. Could be modified according valid English rules
    return true;
  }

  private endsWith(str: string, endings: string[]): boolean {
    return !!endings.find((end: string) => str.endsWith(end));
  }

  // todo could be changed if condition "Words that begin from “*” are not modified" is added
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private beginsWith(str: string, beginnings: string[]): boolean {
    return false;
  }

  private findDelimiters(str: string): string[] {
    return str.match(this.delimiterRegExp) ?? [];
  }

  private simplifyDelimiters(str: string): string {
    return str.replace(this.delimiterRegExp, ' ');
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
