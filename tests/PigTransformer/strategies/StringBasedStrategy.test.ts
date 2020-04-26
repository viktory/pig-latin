/* eslint @typescript-eslint/no-explicit-any: [0] */

import ArrayBasedStrategy from '../../../src/PigTransformer/strategies/ArrayBasedStrategy';
import InvalidWordsDelimitersCounts from '../../../src/PigTransformer/exceptions/InvalidWordsDelimitersCounts';
import StringBasedStrategy from '../../../src/PigTransformer/strategies/StringBasedStrategy';

const strategy = new StringBasedStrategy();

describe('Tests for transform', () => {
  test('Tests for transform', () => {
    expect(strategy.transform('')).toEqual('');
    expect(strategy.transform('string')).toEqual('tringsay');
    expect(strategy.transform('simple string')).toEqual('implesay tringsay');
    expect(strategy.transform('simple-string')).toEqual('implesay-tringsay');
    expect(strategy.transform('simpleway-string')).toEqual('simpleway-tringsay');
    expect(
      strategy.transform('simple-string\nAncient Greek. ')
    ).toEqual('implesay-tringsay\nAncientway Reekgay. ');
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
      strategy.transform('  simple-str...ing\nAncien.tway    G..reek')
    ).toEqual('  implesay-tring...say\nAncien.tway    Ree..kgay');
    expect(
      strategy.transform('simple-string\nAncient Greekway. ')
    ).toEqual('implesay-tringsay\nAncientway Greekway. ');
  });
});
