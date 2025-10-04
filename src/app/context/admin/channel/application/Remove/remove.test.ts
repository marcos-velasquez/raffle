import * as E from '@sweet-monads/either';
import { bus } from '@shared/domain/event/event-bus.model';
import { EitherBuilder } from '@shared/domain/either/either.builder';
import { BaseRepository, Exception } from '@shared/domain';
import { Channel } from '@context/shared/domain/channel';
import { ChannelMother } from '@context/shared/domain/__tests__/builders/channel.mother.test';
import { ChannelRemovedEvent } from '../../domain/channel.event';
import { RemoveChannelUseCase } from './remove.usecase';

jest.mock('@shared/domain/event/event-bus.model', () => ({ bus: { publish: jest.fn() } }));

describe('RemoveChannelUseCase', () => {
  let useCase: RemoveChannelUseCase;
  let mockChannelRepositoryService: Partial<jest.Mocked<BaseRepository<Channel>>>;

  beforeEach(() => {
    mockChannelRepositoryService = { remove: jest.fn() };
    useCase = new RemoveChannelUseCase(mockChannelRepositoryService as BaseRepository<Channel>);
  });

  it('should publish ChannelRemoved event and complete with success message on successful remove', async () => {
    const channel = ChannelMother.usd();
    mockChannelRepositoryService.remove?.mockResolvedValue(E.right(channel));

    const result = await useCase['next'](channel);

    expect(mockChannelRepositoryService.remove).toHaveBeenCalledTimes(1);
    expect(mockChannelRepositoryService.remove).toHaveBeenCalledWith(channel);
    expect(bus.publish).toHaveBeenCalledWith(new ChannelRemovedEvent(channel));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(channel)).build());
  });

  it('should complete with error message on failed remove', async () => {
    const channel = ChannelMother.euro();
    const exception = new Exception('Remove channel failed');
    mockChannelRepositoryService.remove?.mockResolvedValue(E.left(exception));

    const result = await useCase['next'](channel);

    expect(mockChannelRepositoryService.remove).toHaveBeenCalledTimes(1);
    expect(mockChannelRepositoryService.remove).toHaveBeenCalledWith(channel);
    expect(bus.publish).toHaveBeenCalledWith(expect.objectContaining({ exception }));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.left(exception)).build());
  });

  it('should handle random channel removal', async () => {
    const channel = ChannelMother.random();
    mockChannelRepositoryService.remove?.mockResolvedValue(E.right(channel));

    const result = await useCase['next'](channel);

    expect(mockChannelRepositoryService.remove).toHaveBeenCalledTimes(1);
    expect(mockChannelRepositoryService.remove).toHaveBeenCalledWith(channel);
    expect(bus.publish).toHaveBeenCalledWith(new ChannelRemovedEvent(channel));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(channel)).build());
  });

  it('should handle COP channel removal', async () => {
    const channel = ChannelMother.cop();
    mockChannelRepositoryService.remove?.mockResolvedValue(E.right(channel));

    const result = await useCase['next'](channel);

    expect(mockChannelRepositoryService.remove).toHaveBeenCalledTimes(1);
    expect(mockChannelRepositoryService.remove).toHaveBeenCalledWith(channel);
    expect(bus.publish).toHaveBeenCalledWith(new ChannelRemovedEvent(channel));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(channel)).build());
  });
});
