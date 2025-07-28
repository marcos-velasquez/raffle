import { Aggregate, assert, has, EMAIL_REGEX, not, or } from '@shared/domain';

export class User extends Aggregate<User> {
  private constructor(public readonly email: string) {
    super();
    assert(or(email.length === 0, EMAIL_REGEX.test(email)), 'Email is invalid');
  }

  public get is() {
    return {
      admin: has(this.email),
      empty: not(this.email),
    };
  }

  public toPrimitives<UserPrimitives>(): UserPrimitives {
    return {
      email: this.email,
      id: this.getId(),
    } as UserPrimitives;
  }

  public static empty() {
    return new User('');
  }

  public static from({ email, id }: UserPrimitives) {
    return new User(email).withId(id);
  }

  public static create(email: string) {
    return new User(email);
  }
}

export type UserPrimitives = { email: string; id: string };
