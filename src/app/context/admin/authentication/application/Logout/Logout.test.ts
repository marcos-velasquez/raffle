import * as E from '@sweet-monads/either';
import { bus } from '@shared/domain/event/event-bus.model';
import { EitherBuilder } from '@shared/domain/either/either.builder';
import { AuthenticationService, UserLoggedOut } from '../../../authentication/domain';
import { LogoutUseCase } from './Logout.usecase';

jest.mock('@shared/domain/event/event-bus.model', () => ({ bus: { publish: jest.fn() } }));

describe('LogoutUseCase', () => {
  let useCase: LogoutUseCase;
  let mockAuthenticationService: Partial<jest.Mocked<AuthenticationService>>;

  beforeEach(() => {
    mockAuthenticationService = { logout: jest.fn() };
    useCase = new LogoutUseCase(mockAuthenticationService as AuthenticationService);
  });

  it('should complete with success message on successful logout', async () => {
    mockAuthenticationService.logout?.mockResolvedValue(E.right(undefined));

    const result = await useCase.execute();

    expect(mockAuthenticationService.logout).toHaveBeenCalledTimes(1);
    expect(bus.publish).toHaveBeenCalledWith(new UserLoggedOut());
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(undefined)).build());
  });

  it('should complete with error message on failed logout', async () => {
    const error = new Error('Logout failed');
    mockAuthenticationService.logout?.mockResolvedValue(E.left(error));

    const result = await useCase.execute();

    expect(mockAuthenticationService.logout).toHaveBeenCalledTimes(1);
    expect(bus.publish).toHaveBeenCalledWith(expect.objectContaining({ error: error }));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.left(error)).build());
  });
});
