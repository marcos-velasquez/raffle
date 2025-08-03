import { EMAIL_REGEX } from '../../regex';

describe('regex', () => {
  describe('EMAIL_REGEX', () => {
    it('should match valid email addresses', () => {
      const validEmails = [
        'user@example.com',
        'firstname.lastname@example.com',
        'email@subdomain.example.com',
        'firstname+lastname@example.com',
        'email@123.123.123.123',
        '1234567890@example.com',
        'email@example-one.com',
        '_______@example.com',
        'email@example.name',
        'email@example.museum',
        'email@example.co.jp',
        'firstname-lastname@example.com',
      ];

      validEmails.forEach((email) => {
        expect(EMAIL_REGEX.test(email)).toBe(true);
      });
    });

    it('should not match invalid email addresses', () => {
      const invalidEmails = [
        'plainaddress',
        '@missingusername.com',
        'username@.com',
        '.username@example.com',
        'username@example..com',
        'username@example.com.',
        'username@.example.com',
        'username@.example..com',
        'username@example..com',
        'username@.com.',
        'username@.com',
        'username@-example.com',
        'username@example-.com',
        'username@.example.com',
        'username@.example..com',
        'username@example..com',
        'username@.com.',
        'username@.com',
        'username@.example.com',
        'username@.example..com',
        'username@example..com',
        'username@.com.',
      ];

      invalidEmails.forEach((email) => {
        expect(EMAIL_REGEX.test(email)).toBe(false);
      });
    });

    it('should enforce email length limits', () => {
      const tooLongLocal = 'a'.repeat(65) + '@example.com';
      expect(EMAIL_REGEX.test(tooLongLocal)).toBe(false);

      const tooLongEmail = 'a'.repeat(64) + '@' + 'example.' + 'a'.repeat(181) + '.com';
      expect(EMAIL_REGEX.test(tooLongEmail)).toBe(false);
    });
  });
});
