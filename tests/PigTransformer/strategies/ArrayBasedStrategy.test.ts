/* eslint @typescript-eslint/no-explicit-any: [0] */

import ArrayBasedStrategy from '../../../src/PigTransformer/strategies/ArrayBasedStrategy';
import InvalidWordsDelimitersCounts from '../../../src/PigTransformer/exceptions/InvalidWordsDelimitersCounts';

const strategy = new ArrayBasedStrategy();
describe('Tests for findDelimiters', () => {
  test('Zero delimiter', () => {
    expect((strategy as any).findDelimiters('testString')).toEqual([]);
  });

  test('One delimiter', () => {
    expect((strategy as any).findDelimiters('test string')).toEqual([' ']);
    expect((strategy as any).findDelimiters('test\tstring')).toEqual(['\t']);
    expect((strategy as any).findDelimiters('test\nstring')).toEqual(['\n']);
    expect((strategy as any).findDelimiters('another-testString')).toEqual(['-']);
    expect((strategy as any).findDelimiters(' testString')).toEqual([' ']);
  });

  test('Simple delimiters combination', () => {
    expect(
      (strategy as any).findDelimiters('Lorem ipsum, or lipsum as-it-is sometimes\nknown, is\tdummy text. ')
    ).toEqual([' ', ' ', ' ', ' ', '-', '-', ' ', '\n', ' ', '\t', ' ', ' ']);
  });

  test('Complex delimiters combination', () => {
    expect(
      (strategy as any).findDelimiters(
        ' --- Lorem    ipsum,  -  -- or lipsum \n as-it-is sometimes\n\t   \n\n\nknown, is\t-dummy text. '
      )
    ).toEqual([' --- ', '    ', '  -  -- ', ' ', ' \n ', '-', '-', ' ', '\n\t   \n\n\n', ' ', '\t-', ' ', ' ']);
  });
});

describe('Tests for simplifyDelimiters', () => {
  test('One delimiter', () => {
    expect((strategy as any).simplifyDelimiters('test string')).toEqual('test string');
    expect((strategy as any).simplifyDelimiters('test\tstring')).toEqual('test string');
    expect((strategy as any).simplifyDelimiters('test\nstring')).toEqual('test string');
    expect((strategy as any).simplifyDelimiters('another-testString')).toEqual('another testString');
    expect((strategy as any).simplifyDelimiters(' firstSpace')).toEqual(' firstSpace');
  });

  test('Simple delimiters combination', () => {
    expect(
      (strategy as any).simplifyDelimiters('Lorem ipsum, or lipsum as-it-is sometimes\nknown, is\tdummy text. ')
    ).toEqual('Lorem ipsum, or lipsum as it is sometimes known, is dummy text. ');
  });
  test('Complex delimiters combination', () => {
    expect(
      (strategy as any).simplifyDelimiters(
        'Lorem    ipsum,  -  -- or lipsum \n as-it-is sometimes\n\t   \n\n\nknown, is\t-dummy text. '
      )
    ).toEqual('Lorem ipsum, or lipsum as it is sometimes known, is dummy text. ');
  });
});

describe('Tests for concat', () => {
  describe('Tests for exceptions', () => {
    test('Too many words', () => {
      expect(
        () => { (strategy as any).concat(['a', 'b', 'c'], [' ']); }
      ).toThrow(new InvalidWordsDelimitersCounts('InvalidWordsDelimitersCounts: too many words'));
    });

    test('Too many delimiters', () => {
      expect(
        () => { (strategy as any).concat(['a', 'b'], [' ', ' ', '-']); }
      ).toThrow(new InvalidWordsDelimitersCounts('InvalidWordsDelimitersCounts: too many delimiters'));
    });
  });

  test('Zero word', () => {
    expect((strategy as any).concat([], [])).toEqual('');
  });

  test('One word', () => {
    expect((strategy as any).concat(['word'], [])).toEqual('word');
  });

  test('One delimiter', () => {
    expect(
      () => { (strategy as any).concat([], [' ']); }
    ).toThrow(new InvalidWordsDelimitersCounts('InvalidWordsDelimitersCounts: too many delimiters'));
  });

  test('One word + one delimiter', () => {
    expect((strategy as any).concat(['word'], [' '])).toEqual('word ');
  });

  test('Default case words === delimiters + 1', () => {
    expect((strategy as any).concat(['a', 'b', 'c'], [' ', '-'])).toEqual('a b-c');
  });

  test('Default case words === delimiters', () => {
    expect((strategy as any).concat(['a', 'b', 'c'], [' ', '-', '\n'])).toEqual('a b-c\n');
  });
});

describe('Tests for endsWith and beginsWith', () => {
  describe('Tests for beginsWith', () => {
    test('Test beginsWith', () => {
      expect(
        (strategy as any).beginsWith('word', ['any', 'array'])
      ).toBeFalsy();
    });
  });

  describe('Tests for endsWith', () => {
    test('endsWith is false', () => {
      expect((strategy as any).endsWith('wordway', ['any', 'array'])).toBeFalsy();
    });

    test('endsWith is true', () => {
      expect((strategy as any).endsWith('wordway', ['any', 'array', 'way'])).toBeTruthy();
    });
  });
});

describe('Tests for consonants/vowels as first character', () => {
  describe('Tests for CONSONANT_VOWEL_LETTERS', () => {
    test('CONSONANT_VOWEL_LETTERS are always consonants', () => {
      expect((strategy as any).isConsonantVowelConsonant('y')).toBeTruthy();
    });
  });

  describe('Tests for isCharacterConsonant', () => {
    test('CONSONANT_LETTERS', () => {
      expect((strategy as any).isCharacterConsonant('b')).toBeTruthy();
      expect((strategy as any).isCharacterConsonant('n')).toBeTruthy();
    });

    test('VOWEL_LETTERS', () => {
      expect((strategy as any).isCharacterConsonant('a')).toBeFalsy();
      expect((strategy as any).isCharacterConsonant('o')).toBeFalsy();
    });

    test('CONSONANT_VOWEL_LETTERS', () => {
      expect((strategy as any).isCharacterConsonant('y')).toBeTruthy();
    });
  });
});

describe('Tests for modifyAsConsonant and modifyAsVowel', () => {
  test('modifyAsConsonant', () => {
    expect((strategy as any).modifyAsConsonant('test')).toEqual('esttay');
    expect((strategy as any).modifyAsConsonant('t')).toEqual('tay');
  });

  test('modifyAsVowel', () => {
    expect((strategy as any).modifyAsVowel('apple')).toEqual('appleway');
    expect((strategy as any).modifyAsVowel('a')).toEqual('away');
  });
});

describe('Tests for capitalize', () => {
  test('Tests for simple words', () => {
    expect((strategy as any).capitalize('test', 'apple')).toEqual('apple');
    expect((strategy as any).capitalize('Test', 'apple')).toEqual('Apple');
    expect((strategy as any).capitalize('SoMeOrIgIn', 'differentstring')).toEqual('DiFfErEnTstring');
  });
});

describe('Tests for putSpecialCharacters', () => {
  test('Tests for simple specialChars', () => {
    expect((strategy as any).putSpecialCharacters('test.', 'apple')).toEqual('apple.');
    expect((strategy as any).putSpecialCharacters('Test.', 'apple')).toEqual('apple.');
    expect((strategy as any).putSpecialCharacters('Test', 'apple')).toEqual('apple');
    expect((strategy as any).putSpecialCharacters('T\'est', 'apple')).toEqual('ap\'ple');
    expect((strategy as any).putSpecialCharacters('T\'est', 'Apple')).toEqual('Ap\'ple');
  });

  test('Tests for simple nonLatin characters', () => {
    expect((strategy as any).putSpecialCharacters('Teйst', 'apple')).toEqual('appйle');
    expect((strategy as any).putSpecialCharacters('бвгд', 'apple')).toEqual('appleбвгд');
    expect((strategy as any).putSpecialCharacters('te.,.st', 'apple')).toEqual('app.,.le');
    expect((strategy as any).putSpecialCharacters('ТЕст', 'apple')).toEqual('appleТЕст');
    expect((strategy as any).putSpecialCharacters('tesřt', 'apple')).toEqual('applře');
    expect((strategy as any).putSpecialCharacters('和test', 'apple')).toEqual('a和pple');
  });
});

describe('Tests for modify', () => {
  test('empty word', () => {
    expect((strategy as any).modify('')).toEqual('');
    expect((strategy as any).modify('  .  ')).toEqual('  .  ');
  });

  test('word ends in "way"', () => {
    expect((strategy as any).modify('wordway')).toEqual('wordway');
    expect((strategy as any).modify('appleway')).toEqual('appleway');
    expect((strategy as any).modify('wordway.')).toEqual('wordway.');
    expect((strategy as any).modify('WORDWAY')).toEqual('WORDWAY');
    expect((strategy as any).modify('WORDWAY.')).toEqual('WORDWAY.');
  });

  test('word begins with consonant', () => {
    expect((strategy as any).modify('string')).toEqual('tringsay');
    expect((strategy as any).modify('string.')).toEqual('tringsay.');
    expect((strategy as any).modify('sTrin\'g')).toEqual('tRingsa\'y');
    expect((strategy as any).modify('...string')).toEqual('tr...ingsay');
  });

  test('word begins with vowel', () => {
    expect((strategy as any).modify('apple')).toEqual('appleway');
    expect((strategy as any).modify('apple.')).toEqual('appleway.');
    expect((strategy as any).modify('aPpl\'e')).toEqual('aPplewa\'y');
    expect((strategy as any).modify('...apple')).toEqual('app...leway');
  });
});

describe('Tests for transform', () => {
  test('Tests for transform', () => {
    expect((strategy as any).transform('')).toEqual('');
    expect((strategy as any).transform('string')).toEqual('tringsay');
    expect((strategy as any).transform('simple string')).toEqual('implesay tringsay');
    expect((strategy as any).transform('simple-string')).toEqual('implesay-tringsay');
    expect(
      (strategy as any).transform('simple-string\nAncient Greek. ')
    ).toEqual('implesay-tringsay\nAncientway Reekgay. ');
    expect(
      (strategy as any).transform('  simple-string\nAncient Greek')
    ).toEqual('  implesay-tringsay\nAncientway Reekgay');
    expect(
      (strategy as any).transform('  simple-string\nAncient Greek?-- ')
    ).toEqual('  implesay-tringsay\nAncientway Reekgay?-- ');
  });
});
