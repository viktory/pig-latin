/* eslint @typescript-eslint/no-explicit-any: [0] */

import ArrayBasedStrategy from '../../../src/PigTransformer/strategies/ArrayBasedStrategy';
import InvalidWordsDelimitersCounts from '../../../src/PigTransformer/exceptions/InvalidWordsDelimitersCounts';
import WordModifierCommand from '../../../src/PigTransformer/commands/WordModifierCommand';

const strategy = new ArrayBasedStrategy(new WordModifierCommand());

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

describe('Tests for transform', () => {
  test('Tests for transform', () => {
    expect(strategy.transform('')).toEqual('');
    expect(strategy.transform('string')).toEqual('tringsay');
    expect(strategy.transform('simple string')).toEqual('implesay tringsay');
    expect(strategy.transform('simple-string')).toEqual('implesay-tringsay');
    expect(strategy.transform('simpleway-string')).toEqual('simpleway-tringsay');
    expect(
      strategy.transform('simple-string\nAncient   Greek. ')
    ).toEqual('implesay-tringsay\nAncientway   Reekgay. ');
    expect(
      strategy.transform('  simple-string\nAncient Greek')
    ).toEqual('  implesay-tringsay\nAncientway Reekgay');
    expect(
      strategy.transform('  simple-string\nAncient Greek?-- ')
    ).toEqual('  implesay-tringsay\nAncientway Reekgay?-- ');
    expect(
      strategy.transform('  simple-string\nAncientway Greek')
    ).toEqual('  implesay-tringsay\nAncientway Reekgay');
    expect(
      strategy.transform('  simple-string\nAncien.tway    Greek')
    ).toEqual('  implesay-tringsay\nAncien.tway    Reekgay');
    expect(
      strategy.transform('simple-string\nAncient Greekway. ')
    ).toEqual('implesay-tringsay\nAncientway Greekway. ');
    expect(
      strategy.transform('Greekway.')
    ).toEqual('Greekway.');
  });
});
