import PigStrategyInterface from './PigStrategyInterface';
import {
  CONSONANT_POSTFIX, CONSONANT_PREFIX,
  STOP_MODIFYING_POSTFIXES,
  STOP_MODIFYING_PREFIXES,
  VOWEL_POSTFIX, VOWEL_PREFIX
} from '../config';
import InvalidWordsDelimitersCounts from '../exceptions/InvalidWordsDelimitersCounts';
import {
  beginsWith, convertCharInCorrectCase,
  delimiterRegExp, endsWith, getDelimiters, hasSpecialCharactersOnly, isCharacterConsonant, specialCharactersRegExp
} from '../utils';

export default class ArrayBasedStrategy implements PigStrategyInterface {
  public transform(origin: string): string {
    const delimiters = getDelimiters(origin);
    const words = this.simplifyDelimiters(origin).split(' ').map((word: string) => this.modify(word));

    return this.concat(words, delimiters);
  }

  private modify(word: string): string {
    let wordsWithoutSpecialChars = word.toLowerCase().replace(specialCharactersRegExp, '');

    if (
      (wordsWithoutSpecialChars.length === 0)
      || endsWith(wordsWithoutSpecialChars, STOP_MODIFYING_POSTFIXES)
      || beginsWith(wordsWithoutSpecialChars, STOP_MODIFYING_PREFIXES)
    ) {
      return word;
    }

    wordsWithoutSpecialChars = isCharacterConsonant(wordsWithoutSpecialChars[0])
      ? this.modifyAsConsonant(wordsWithoutSpecialChars)
      : this.modifyAsVowel(wordsWithoutSpecialChars);

    return this.putSpecialCharacters(word, this.capitalize(word, wordsWithoutSpecialChars));
  }

  private capitalize(origin: string, result: string): string {
    const resultArray = result.split('');

    origin.split('').forEach((char: string, index: number) => {
      resultArray[index] = convertCharInCorrectCase(resultArray[index] ?? '', char);
    });

    return resultArray.join('');
  }

  private putSpecialCharacters(origin: string, resultWithoutSpecialCharacters: string): string {
    const originArray = origin.split('');
    let result = resultWithoutSpecialCharacters;
    for (let i = originArray.length - 1, positionFromEnd = 0; i >= 0; i -= 1, positionFromEnd += 1) {
      if (hasSpecialCharactersOnly(originArray[i])) {
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
