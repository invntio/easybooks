import { xssCleanObject, xssCleanString } from './xssclean.util';

describe('XSS Clean Util', () => {
  describe('xssCleanString method', () => {
    it('should be defined', () => {
      expect(xssCleanString).toBeDefined();
    });

    it('should return the same string', () => {
      expect(xssCleanString('John Dale')).toBe('John Dale');
    });

    it('should return sanitized script tag', () => {
      expect(xssCleanString('<script>alert(1)</script>')).toBe(
        '&lt;script>alert(1)&lt;/script>',
      );
    });

    it('should return sanitized html5 tag', () => {
      expect(
        xssCleanString(
          '<header onclick="alert(1)" style=display:block>test</header>',
        ),
      ).toBe(
        '&lt;header onclick="alert(1)" style=display:block>test&lt;/header>',
      );
    });
  });

  describe('xssCleanObject method', () => {
    it('should be defined', () => {
      expect(xssCleanObject).toBeDefined();
    });

    it('should return the same object', () => {
      const mockBody = {
        name: 'John',
        email: 'john@example.com',
      };

      expect(xssCleanObject(mockBody)).toEqual(mockBody);
    });

    it('should return the object with sanitized properties', () => {
      const mockBody = {
        name: 'John',
        email: 'john@example.com',
        xssProp: '<script>alert(1)</script>',
      };

      const expectedBody = {
        name: 'John',
        email: 'john@example.com',
        xssProp: '&lt;script>alert(1)&lt;/script>',
      };

      expect(xssCleanObject(mockBody)).toEqual(expectedBody);
    });
  });
});
