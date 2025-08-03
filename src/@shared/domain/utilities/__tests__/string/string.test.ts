import { $string } from '../../string/string';

describe('string utilities', () => {
  describe('capitalize', () => {
    it('should capitalize the first letter of a string', () => {
      expect($string.capitalize('hello')).toBe('Hello');
      expect($string.capitalize('world')).toBe('World');
      expect($string.capitalize('typescript')).toBe('Typescript');
    });

    it('should handle empty strings', () => {
      expect($string.capitalize('')).toBe('');
    });

    it('should handle single-character strings', () => {
      expect($string.capitalize('a')).toBe('A');
      expect($string.capitalize('z')).toBe('Z');
    });

    it('should not change already capitalized strings', () => {
      expect($string.capitalize('Hello')).toBe('Hello');
      expect($string.capitalize('WORLD')).toBe('WORLD');
    });

    it('should handle strings with leading whitespace', () => {
      expect($string.capitalize(' hello')).toBe(' hello');
      expect($string.capitalize('  test')).toBe('  test');
    });

    it('should handle strings with non-alphabetic first characters', () => {
      expect($string.capitalize('123abc')).toBe('123abc');
      expect($string.capitalize('!test')).toBe('!test');
      expect($string.capitalize('@name')).toBe('@name');
    });
  });
});
