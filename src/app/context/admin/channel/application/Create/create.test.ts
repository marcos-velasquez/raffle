import * as E from '@sweet-monads/either';
import { bus } from '@shared/domain/event/event-bus.model';
import { EitherBuilder } from '@shared/domain/either/either.builder';
import { BaseRepository, Exception } from '@shared/domain';
import { Channel } from '@context/shared/domain/channel';
import { ChannelMother } from '@context/shared/domain/__tests__/builders/channel.mother.test';
import { ChannelCreatedEvent } from '../../domain/channel.event';
import { CreateChannelUseCase, CreateChannelUseCaseProps } from './create.usecase';

jest.mock('@shared/domain/event/event-bus.model', () => ({ bus: { publish: jest.fn() } }));

describe('CreateChannelUseCase', () => {
  let useCase: CreateChannelUseCase;
  let mockChannelRepositoryService: Partial<jest.Mocked<BaseRepository<Channel>>>;

  beforeEach(() => {
    mockChannelRepositoryService = { save: jest.fn() };
    useCase = new CreateChannelUseCase(mockChannelRepositoryService as BaseRepository<Channel>);
  });

  it('should publish ChannelCreated event and complete with success message on successful create', async () => {
    const channel = ChannelMother.usd();
    const props: CreateChannelUseCaseProps = {
      currency: channel.currency,
      details: channel.details,
      image: channel.image,
    };
    mockChannelRepositoryService.save?.mockResolvedValue(E.right(channel));

    const result = await useCase['next'](props);

    expect(mockChannelRepositoryService.save).toHaveBeenCalledTimes(1);
    expect(bus.publish).toHaveBeenCalledWith(new ChannelCreatedEvent(channel));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(channel)).build());
  });

  it('should complete with error message on failed create', async () => {
    const channel = ChannelMother.euro();
    const props: CreateChannelUseCaseProps = {
      currency: channel.currency,
      details: channel.details,
      image: channel.image,
    };
    const exception = new Exception('Create channel failed');
    mockChannelRepositoryService.save?.mockResolvedValue(E.left(exception));

    const result = await useCase['next'](props);

    expect(mockChannelRepositoryService.save).toHaveBeenCalledTimes(1);
    expect(bus.publish).toHaveBeenCalledWith(expect.objectContaining({ exception }));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.left(exception)).build());
  });

  it('should handle different currency channels', async () => {
    const channel = ChannelMother.cop();
    const props: CreateChannelUseCaseProps = {
      currency: channel.currency,
      details: channel.details,
      image: channel.image,
    };
    mockChannelRepositoryService.save?.mockResolvedValue(E.right(channel));

    const result = await useCase['next'](props);

    expect(mockChannelRepositoryService.save).toHaveBeenCalledTimes(1);
    expect(bus.publish).toHaveBeenCalledWith(new ChannelCreatedEvent(channel));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(channel)).build());
  });

  it('should handle random channel data', async () => {
    const channel = ChannelMother.random();
    const props: CreateChannelUseCaseProps = {
      currency: channel.currency,
      details: channel.details,
      image: channel.image,
    };
    mockChannelRepositoryService.save?.mockResolvedValue(E.right(channel));

    const result = await useCase['next'](props);

    expect(mockChannelRepositoryService.save).toHaveBeenCalledTimes(1);
    expect(bus.publish).toHaveBeenCalledWith(new ChannelCreatedEvent(channel));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(channel)).build());
  });
});
