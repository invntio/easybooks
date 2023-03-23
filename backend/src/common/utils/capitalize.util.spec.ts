import { capitalizeString } from './capitalize.util';

describe('Capitalize String Util', () => {
  it('should return capitalized string', () => {
    const initial = 'test string for capitalization';
    const expected = 'Test string for capitalization';

    expect(capitalizeString(initial)).toEqual(expected);
  });

  it('should return the same string if is already capitalized', () => {
    const initial = 'Test already capitalized';
    const expected = 'Test already capitalized';

    expect(capitalizeString(initial)).toEqual(expected);
  });

  it('should return the same string if empty', () => {
    const initial = '';
    const expected = '';

    expect(capitalizeString(initial)).toEqual(expected);
  });
});
