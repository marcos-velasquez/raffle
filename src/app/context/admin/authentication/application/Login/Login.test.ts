import * as E from '@sweet-monads/either';
import { bus } from '@shared/domain/event/event-bus.model';
import { EitherBuilder } from '@shared/domain/either/either.builder';
import { User, AuthenticationService, UserLoggedIn } from '../../domain';
import { LoginUseCase } from './Login.usecase';

jest.mock('@shared/domain/event/event-bus.model', () => ({ bus: { publish: jest.fn() } }));

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let mockAuthenticationService: Partial<jest.Mocked<AuthenticationService>>;
  const validInput = { email: 'email@example.com', password: 'password' };

  beforeEach(() => {
    mockAuthenticationService = { login: jest.fn() };
    useCase = new LoginUseCase(mockAuthenticationService as AuthenticationService);
  });

  it('should publish UserLoggedIn event and complete with success message on successful login', async () => {
    const user = User.create(validInput.email);
    mockAuthenticationService.login?.mockResolvedValue(E.right(user));

    const result = await useCase.execute(validInput);

    expect(mockAuthenticationService.login).toHaveBeenCalledTimes(1);
    expect(mockAuthenticationService.login).toHaveBeenCalledWith(validInput);
    expect(bus.publish).toHaveBeenCalledWith(new UserLoggedIn(user));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(user)).build());
  });

  it('should complete with error message on failed login', async () => {
    const error = new Error('Login failed');
    mockAuthenticationService.login?.mockResolvedValue(E.left(error));

    const result = await useCase.execute(validInput);

    expect(mockAuthenticationService.login).toHaveBeenCalledTimes(1);
    expect(mockAuthenticationService.login).toHaveBeenCalledWith(validInput);
    expect(bus.publish).toHaveBeenCalledWith(expect.objectContaining({ error: error }));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.left(error)).build());
  });
});
