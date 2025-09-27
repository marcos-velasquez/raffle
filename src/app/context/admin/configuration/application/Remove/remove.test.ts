import * as E from '@sweet-monads/either';
import { bus } from '@shared/domain/event/event-bus.model';
import { EitherBuilder } from '@shared/domain/either/either.builder';
import { BaseRepository, Exception } from '@shared/domain';
import { Configuration } from '@context/shared/domain';
import { ConfigurationMother } from '@context/shared/domain/__tests__/builders/configuration.mother.test';
import { ConfigurationBuilder } from '@context/shared/domain/__tests__/builders/configuration.builder.test';
import { ConfigurationRemovedEvent } from '../../domain/configuration.event';
import { RemoveConfigurationUseCase } from './remove.usecase';

jest.mock('@shared/domain/event/event-bus.model', () => ({ bus: { publish: jest.fn() } }));

describe('RemoveConfigurationUseCase', () => {
  let useCase: RemoveConfigurationUseCase;
  let mockConfigurationRepositoryService: Partial<jest.Mocked<BaseRepository<Configuration>>>;

  beforeEach(() => {
    mockConfigurationRepositoryService = { remove: jest.fn() };
    useCase = new RemoveConfigurationUseCase(mockConfigurationRepositoryService as BaseRepository<Configuration>);
  });

  it('should publish ConfigurationRemoved event and complete with success message on successful remove', async () => {
    const configuration = ConfigurationMother.usd();
    mockConfigurationRepositoryService.remove?.mockResolvedValue(E.right(configuration));

    const result = await useCase['next'](configuration);

    expect(mockConfigurationRepositoryService.remove).toHaveBeenCalledTimes(1);
    expect(mockConfigurationRepositoryService.remove).toHaveBeenCalledWith(configuration);
    expect(bus.publish).toHaveBeenCalledWith(new ConfigurationRemovedEvent(configuration));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(configuration)).build());
  });

  it('should complete with error message on failed remove', async () => {
    const configuration = ConfigurationMother.euro();
    const exception = new Exception('Remove configuration failed');
    mockConfigurationRepositoryService.remove?.mockResolvedValue(E.left(exception));

    const result = await useCase['next'](configuration);

    expect(mockConfigurationRepositoryService.remove).toHaveBeenCalledTimes(1);
    expect(mockConfigurationRepositoryService.remove).toHaveBeenCalledWith(configuration);
    expect(bus.publish).toHaveBeenCalledWith(expect.objectContaining({ exception }));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.left(exception)).build());
  });

  it('should handle random configuration removal', async () => {
    const configuration = ConfigurationMother.random();
    mockConfigurationRepositoryService.remove?.mockResolvedValue(E.right(configuration));

    const result = await useCase['next'](configuration);

    expect(mockConfigurationRepositoryService.remove).toHaveBeenCalledTimes(1);
    expect(mockConfigurationRepositoryService.remove).toHaveBeenCalledWith(configuration);
    expect(bus.publish).toHaveBeenCalledWith(new ConfigurationRemovedEvent(configuration));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(configuration)).build());
  });

  it('should handle COP configuration removal', async () => {
    const configuration = ConfigurationBuilder.cop().build();
    mockConfigurationRepositoryService.remove?.mockResolvedValue(E.right(configuration));

    const result = await useCase['next'](configuration);

    expect(mockConfigurationRepositoryService.remove).toHaveBeenCalledTimes(1);
    expect(mockConfigurationRepositoryService.remove).toHaveBeenCalledWith(configuration);
    expect(bus.publish).toHaveBeenCalledWith(new ConfigurationRemovedEvent(configuration));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(configuration)).build());
  });
});
