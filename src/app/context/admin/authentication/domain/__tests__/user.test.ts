import { User } from '../user.model';

const testId = 'testId';
const testEmail = 'jz4Y8@example.com';

describe('User', () => {
  it('should throw an error if email is invalid', () => {
    expect(() => User.from({ email: 'invalid-email', id: testId })).toThrow();
    expect(() => User.from({ email: 'invalid email@hotmail.com', id: testId })).toThrow();
    expect(() => User.from({ email: 'invalid-email@gmail', id: testId })).toThrow();
    expect(() => User.from({ email: 'invalid-email@gmail..com', id: testId })).toThrow();
    expect(() => User.from({ email: 'invalid-email@gmail.1', id: testId })).toThrow();
  });

  it('should create a empty user', () => {
    expect(User.empty().email).toBe('');
    expect(User.empty().is.empty).toBe(true);
  });

  it('should successfully create a User object with a valid email', () => {
    expect(User.create(testEmail).email).toBe(testEmail);
    expect(User.create(testEmail).is.empty).toBe(false);
  });

  it('should return primitives', () => {
    const user = User.from({ email: testEmail, id: testId });
    expect(user.toPrimitives()).toEqual({ email: testEmail, id: testId });
  });
});
