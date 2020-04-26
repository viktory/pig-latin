import {
  CONSONANT_LETTERS, CONSONANT_VOWEL_LETTERS, VOWEL_LETTERS, WORD_SEPARATORS
} from './config';

export const delimiterRegExp = RegExp(`[${WORD_SEPARATORS.join('')}]{1,}`, 'g');

export const specialCharactersRegExp = RegExp(
  `[^${CONSONANT_LETTERS.join('')}${VOWEL_LETTERS.join('')}${CONSONANT_VOWEL_LETTERS.join('')}]`,
  'g'
);

export const getDelimiters = (str: string): string[] => str.toLowerCase().match(delimiterRegExp) ?? [];

export const hasDelimiter = (str: string): boolean => getDelimiters(str).length > 0;

export const hasSpecialCharactersOnly = (str: string): boolean => (
  (str.toLowerCase().match(specialCharactersRegExp) !== null) && !hasDelimiter(str)
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isConsonantVowelConsonant = (char: string): boolean => true;

export const isCharacterConsonant = (char: string): boolean => {
  const lowerCaseChar = char.toLowerCase();

  return (
    (CONSONANT_LETTERS.indexOf(lowerCaseChar) > -1)
    || ((CONSONANT_VOWEL_LETTERS.indexOf(lowerCaseChar) > -1) && isConsonantVowelConsonant(lowerCaseChar))
  );
};

export const isCharacterVowel = (char: string): boolean => {
  const lowerCaseChar = char.toLowerCase();

  return (
    (VOWEL_LETTERS.indexOf(lowerCaseChar) > -1)
    || ((CONSONANT_VOWEL_LETTERS.indexOf(lowerCaseChar) > -1) && !isConsonantVowelConsonant(lowerCaseChar))
  );
};

export const endsWith = (str: string, endings: string[]): boolean => !!endings.find((end: string) => str.endsWith(end));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const beginsWith = (str: string, beginnings: string[]): boolean => false;

export const convertCharInCorrectCase = (char: string, actualCaseChar: string): string => (
  (actualCaseChar === actualCaseChar.toLowerCase())
    ? char.toLowerCase()
    : char.toUpperCase()
);
