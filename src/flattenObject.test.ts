import { flattenOutput } from './flattenOutput';

import { describe, expect, it } from 'bun:test';

describe('flattenObject', () => {
  it.each([
    {
      input: { a: 1, b: 2, c: { d: 3 } },
      expected: { output_a: 1, output_b: 2, output_c_d: 3 },
    },
    {
      input: { a: '42', b: ['c', 'd'] },
      expected: { output_a: '42', output_b_0: 'c', output_b_1: 'd' },
    },
    {
      input: [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }],
      expected: { output_0_name: 'John', output_0_age: 30, output_1_name: 'Jane', output_1_age: 25 },
    },
    {
      input: 'some string',
      expected: {
        output: 'some string',
      },
    },
    // TODO: this case is to be fixed
    {
      input: {
        gg: [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }],
      },
      expected: { output_gg_0_name: 'John', output_gg_0_age: 30, output_gg_1_name: 'Jane', output_gg_1_age: 25 },
    },
  ])('flattens $input to $expected', ({ input, expected }) => {
    const result = flattenOutput(input);
    expect(result).toEqual(expected);
  });
});
