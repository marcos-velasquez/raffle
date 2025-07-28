import { assert, EMAIL_REGEX } from '@shared/domain';

export class Credential {
  public static readonly MIN_PASSWORD_LENGTH = 6;

  private constructor(public readonly email: string, public readonly password: string) {
    assert(email.length > 0, 'Email is required');
    assert(EMAIL_REGEX.test(email), 'Email is invalid');
    assert(password.length >= Credential.MIN_PASSWORD_LENGTH, 'Password is too short');
  }

  public static from(input: { email: string; password: string }): Credential {
    return new Credential(input.email, input.password);
  }
}
