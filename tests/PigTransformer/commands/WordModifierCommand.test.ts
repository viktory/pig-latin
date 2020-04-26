/* eslint @typescript-eslint/no-explicit-any: [0] */

import WordModifierCommand from '../../../src/PigTransformer/commands/WordModifierCommand';

const command = new WordModifierCommand();

describe('Tests for modifyAsConsonant and modifyAsVowel', () => {
  test('modifyAsConsonant', () => {
    expect((command as any).modifyAsConsonant('test')).toEqual('esttay');
    expect((command as any).modifyAsConsonant('t')).toEqual('tay');
  });

  test('modifyAsVowel', () => {
    expect((command as any).modifyAsVowel('apple')).toEqual('appleway');
    expect((command as any).modifyAsVowel('a')).toEqual('away');
  });
});


describe('Tests for capitalize', () => {
  test('Tests for simple words', () => {
    expect((command as any).capitalize('test', 'apple')).toEqual('apple');
    expect((command as any).capitalize('Test', 'apple')).toEqual('Apple');
    expect((command as any).capitalize('SoMeOrIgIn', 'differentstring')).toEqual('DiFfErEnTstring');
  });
});

describe('Tests for putSpecialCharacters', () => {
  test('Tests for simple specialChars', () => {
    expect((command as any).putSpecialCharacters('test.', 'apple')).toEqual('apple.');
    expect((command as any).putSpecialCharacters('Test.', 'apple')).toEqual('apple.');
    expect((command as any).putSpecialCharacters('Test', 'apple')).toEqual('apple');
    expect((command as any).putSpecialCharacters('T\'est', 'apple')).toEqual('ap\'ple');
    expect((command as any).putSpecialCharacters('T\'est', 'Apple')).toEqual('Ap\'ple');
  });

  test('Tests for simple nonLatin characters', () => {
    expect((command as any).putSpecialCharacters('Teйst', 'apple')).toEqual('appйle');
    expect((command as any).putSpecialCharacters('бвгд', 'apple')).toEqual('appleбвгд');
    expect((command as any).putSpecialCharacters('te.,.st', 'apple')).toEqual('app.,.le');
    expect((command as any).putSpecialCharacters('ТЕст', 'apple')).toEqual('appleТЕст');
    expect((command as any).putSpecialCharacters('tesřt', 'apple')).toEqual('applře');
    expect((command as any).putSpecialCharacters('和test', 'apple')).toEqual('a和pple');
  });
});

describe('Tests for modify', () => {
  test('empty word', () => {
    expect(command.modify('')).toEqual('');
    expect(command.modify('  .  ')).toEqual('  .  ');
  });

  test('word ends in "way"', () => {
    expect(command.modify('wordway')).toEqual('wordway');
    expect(command.modify('appleway')).toEqual('appleway');
    expect(command.modify('wordway.')).toEqual('wordway.');
    expect(command.modify('WORDWAY')).toEqual('WORDWAY');
    expect(command.modify('WORDWAY.')).toEqual('WORDWAY.');
  });

  test('word begins with consonant', () => {
    expect(command.modify('string')).toEqual('tringsay');
    expect(command.modify('string.')).toEqual('tringsay.');
    expect(command.modify('sTrin\'g')).toEqual('tRingsa\'y');
    expect(command.modify('...string')).toEqual('tr...ingsay');
  });

  test('word begins with vowel', () => {
    expect(command.modify('apple')).toEqual('appleway');
    expect(command.modify('apple.')).toEqual('appleway.');
    expect(command.modify('aPpl\'e')).toEqual('aPplewa\'y');
    expect(command.modify('...apple')).toEqual('app...leway');
  });
});
