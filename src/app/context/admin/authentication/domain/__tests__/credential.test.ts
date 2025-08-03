import { Credential } from '../credential.model';

describe('Credential', () => {
  const testEmail = 'jz4Y8@example.com';
  const testPassword = 'password';

  it('should create a credential', () => {
    const credential = Credential.from({ email: testEmail, password: testPassword });
    expect(credential.email).toBe(testEmail);
    expect(credential.password).toBe(testPassword);
  });

  it('should throw an error if email is not provided', () => {
    expect(() => Credential.from({ email: '', password: testPassword })).toThrow();
  });

  it('should throw an error if password is not provided', () => {
    expect(() => Credential.from({ email: testEmail, password: '' })).toThrow();
  });

  it('should throw an error if email is invalid', () => {
    expect(() => Credential.from({ email: 'invalid-email', password: testPassword })).toThrow();
    expect(() => Credential.from({ email: 'invalid email@hotmail.com', password: testPassword })).toThrow();
    expect(() => Credential.from({ email: 'invalid-email@gmail..com', password: testPassword })).toThrow();
  });

  it('should throw an error if password is too short', () => {
    expect(() => Credential.from({ email: testEmail, password: 'pass' })).toThrow();
  });
});
