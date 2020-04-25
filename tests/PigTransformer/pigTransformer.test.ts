import transform, { PigStrategies } from '../../src/PigTransformer/pigTransformer';
import InvalidStrategyException from '../../src/PigTransformer/exceptions/InvalidStrategyException';
import EmptyStrategyException from '../../src/PigTransformer/exceptions/EmptyStrategyException';

describe('Basic tests for transform', () => {
  test('Invalid strategy', () => {
    expect(() => { transform('test_string'); }).toThrow(new EmptyStrategyException());
    expect(
      () => { transform('test_string', 'invalidStrategy' as unknown as PigStrategies); }
    ).toThrow(new InvalidStrategyException());
  });

  test('Valid strategy', () => {
    expect(
      transform('this is TeSt strigway.?', 'ArrayBased' as unknown as PigStrategies)
    ).toEqual('histay isway EsTtay strigway.?');
    expect(
      transform('   this is TeSt strigway.?', 'ArrayBased' as unknown as PigStrategies)
    ).toEqual('   histay isway EsTtay strigway.?');
  });
});
