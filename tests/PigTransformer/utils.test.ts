import {
  beginsWith, convertCharInCorrectCase, endsWith,
  getDelimiters,
  isCharacterConsonant, isCharacterVowel,
  isConsonantVowelConsonant
} from '../../src/PigTransformer/utils';

describe('Tests for findDelimiters', () => {
  test('Zero delimiter', () => {
    expect(getDelimiters('testString')).toEqual([]);
  });

  test('One delimiter', () => {
    expect(getDelimiters('test string')).toEqual([' ']);
    expect(getDelimiters('test\tstring')).toEqual(['\t']);
    expect(getDelimiters('test\nstring')).toEqual(['\n']);
    expect(getDelimiters('another-testString')).toEqual(['-']);
    expect(getDelimiters(' testString')).toEqual([' ']);
  });

  test('Simple delimiters combination', () => {
    expect(
      getDelimiters('Lorem ipsum, or lipsum as-it-is sometimes\nknown, is\tdummy text. ')
    ).toEqual([' ', ' ', ' ', ' ', '-', '-', ' ', '\n', ' ', '\t', ' ', ' ']);
  });

  test('Complex delimiters combination', () => {
    expect(
      getDelimiters(
        ' --- Lorem    ipsum,  -  -- or lipsum \n as-it-is sometimes\n\t   \n\n\nknown, is\t-dummy text. '
      )
    ).toEqual([' --- ', '    ', '  -  -- ', ' ', ' \n ', '-', '-', ' ', '\n\t   \n\n\n', ' ', '\t-', ' ', ' ']);
  });
});

describe('Tests for consonants/vowels as first character', () => {
  describe('Tests for CONSONANT_VOWEL_LETTERS', () => {
    test('CONSONANT_VOWEL_LETTERS are always consonants', () => {
      expect(isConsonantVowelConsonant('y')).toBeTruthy();
    });
  });

  describe('Tests for isCharacterConsonant', () => {
    test('CONSONANT_LETTERS', () => {
      expect(isCharacterConsonant('b')).toBeTruthy();
      expect(isCharacterConsonant('n')).toBeTruthy();
    });

    test('VOWEL_LETTERS', () => {
      expect(isCharacterConsonant('a')).toBeFalsy();
      expect(isCharacterConsonant('o')).toBeFalsy();
    });

    test('CONSONANT_VOWEL_LETTERS', () => {
      expect(isCharacterConsonant('y')).toBeTruthy();
    });
  });

  describe('Tests for isCharacterVowel', () => {
    test('CONSONANT_LETTERS', () => {
      expect(isCharacterVowel('b')).toBeFalsy();
      expect(isCharacterVowel('n')).toBeFalsy();
    });

    test('VOWEL_LETTERS', () => {
      expect(isCharacterVowel('a')).toBeTruthy();
      expect(isCharacterVowel('o')).toBeTruthy();
    });

    test('CONSONANT_VOWEL_LETTERS', () => {
      expect(isCharacterVowel('y')).toBeFalsy();
    });
  });
});

describe('Tests for endsWith and beginsWith', () => {
  describe('Tests for beginsWith', () => {
    test('Test beginsWith', () => {
      expect(beginsWith('word', ['any', 'array'])).toBeFalsy();
    });
  });

  describe('Tests for endsWith', () => {
    test('endsWith is false', () => {
      expect(endsWith('wordway', ['any', 'array'])).toBeFalsy();
    });

    test('endsWith is true', () => {
      expect(endsWith('wordway', ['any', 'array', 'way'])).toBeTruthy();
    });
  });
});

test('convertCharInCorrectCase', () => {
  expect(convertCharInCorrectCase('a', 'b')).toEqual('a');
  expect(convertCharInCorrectCase('A', 'b')).toEqual('a');
  expect(convertCharInCorrectCase('a', 'B')).toEqual('A');
  expect(convertCharInCorrectCase('A', 'B')).toEqual('A');
});
