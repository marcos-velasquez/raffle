import * as E from '@sweet-monads/either';
import { bus } from '@shared/domain/event/event-bus.model';
import { EitherBuilder } from '@shared/domain/either/either.builder';
import { BaseRepository, Exception } from '@shared/domain';
import { Channel } from '@context/shared/domain';
import { ConfigurationMother } from '@context/shared/domain/__tests__/builders/channel.mother.test';
import { ConfigurationBuilder } from '@context/shared/domain/__tests__/builders/channel.builder.test';
import { ConfigurationRemovedEvent } from '../../domain/channel.event';
import { RemoveConfigurationUseCase } from './remove.usecase';

jest.mock('@shared/domain/event/event-bus.model', () => ({ bus: { publish: jest.fn() } }));

describe('RemoveConfigurationUseCase', () => {
  let useCase: RemoveConfigurationUseCase;
  let mockConfigurationRepositoryService: Partial<jest.Mocked<BaseRepository<Channel>>>;

  beforeEach(() => {
    mockConfigurationRepositoryService = { remove: jest.fn() };
    useCase = new RemoveConfigurationUseCase(mockConfigurationRepositoryService as BaseRepository<Channel>);
  });

  it('should publish ConfigurationRemoved event and complete with success message on successful remove', async () => {
    const channel = ConfigurationMother.usd();
    mockConfigurationRepositoryService.remove?.mockResolvedValue(E.right(channel));

    const result = await useCase['next'](channel);

    expect(mockConfigurationRepositoryService.remove).toHaveBeenCalledTimes(1);
    expect(mockConfigurationRepositoryService.remove).toHaveBeenCalledWith(channel);
    expect(bus.publish).toHaveBeenCalledWith(new ConfigurationRemovedEvent(channel));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(channel)).build());
  });

  it('should complete with error message on failed remove', async () => {
    const channel = ConfigurationMother.euro();
    const exception = new Exception('Remove channel failed');
    mockConfigurationRepositoryService.remove?.mockResolvedValue(E.left(exception));

    const result = await useCase['next'](channel);

    expect(mockConfigurationRepositoryService.remove).toHaveBeenCalledTimes(1);
    expect(mockConfigurationRepositoryService.remove).toHaveBeenCalledWith(channel);
    expect(bus.publish).toHaveBeenCalledWith(expect.objectContaining({ exception }));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.left(exception)).build());
  });

  it('should handle random channel removal', async () => {
    const channel = ConfigurationMother.random();
    mockConfigurationRepositoryService.remove?.mockResolvedValue(E.right(channel));

    const result = await useCase['next'](channel);

    expect(mockConfigurationRepositoryService.remove).toHaveBeenCalledTimes(1);
    expect(mockConfigurationRepositoryService.remove).toHaveBeenCalledWith(channel);
    expect(bus.publish).toHaveBeenCalledWith(new ConfigurationRemovedEvent(channel));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(channel)).build());
  });

  it('should handle COP channel removal', async () => {
    const channel = ConfigurationBuilder.cop().build();
    mockConfigurationRepositoryService.remove?.mockResolvedValue(E.right(channel));

    const result = await useCase['next'](channel);

    expect(mockConfigurationRepositoryService.remove).toHaveBeenCalledTimes(1);
    expect(mockConfigurationRepositoryService.remove).toHaveBeenCalledWith(channel);
    expect(bus.publish).toHaveBeenCalledWith(new ConfigurationRemovedEvent(channel));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(channel)).build());
  });
});
