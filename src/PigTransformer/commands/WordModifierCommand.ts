import {
  beginsWith, convertCharInCorrectCase,
  endsWith,
  hasSpecialCharactersOnly,
  isCharacterConsonant,
  specialCharactersRegExp
} from '../utils';
import {
  CONSONANT_POSTFIX,
  CONSONANT_PREFIX,
  STOP_MODIFYING_POSTFIXES,
  STOP_MODIFYING_PREFIXES, VOWEL_POSTFIX,
  VOWEL_PREFIX
} from '../config';

export interface WordModifierCommandInterface {
  modify: (word: string) => string;
}

export default class WordModifierCommand implements WordModifierCommandInterface {
  public modify(word: string): string {
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

  private modifyAsConsonant(str): string {
    return `${CONSONANT_PREFIX}${str.substr(1) + str.substr(0, 1)}${CONSONANT_POSTFIX}`;
  }

  private modifyAsVowel(str): string {
    return `${VOWEL_PREFIX}${str}${VOWEL_POSTFIX}`;
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

  private capitalize(origin: string, result: string): string {
    const resultArray = result.split('');

    origin.split('').forEach((char: string, index: number) => {
      resultArray[index] = convertCharInCorrectCase(resultArray[index] ?? '', char);
    });

    return resultArray.join('');
  }
}
