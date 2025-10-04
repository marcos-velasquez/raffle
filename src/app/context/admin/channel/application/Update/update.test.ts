import * as E from '@sweet-monads/either';
import { bus } from '@shared/domain/event/event-bus.model';
import { EitherBuilder } from '@shared/domain/either/either.builder';
import { BaseRepository, Exception } from '@shared/domain';
import { Channel, ChannelUpdatePrimitives } from '@context/shared/domain/channel';
import { ChannelMother } from '@context/shared/domain/__tests__/builders/channel.mother.test';
import { ChannelUpdatedEvent } from '../../domain/channel.event';
import { UpdateChannelUseCase, UpdateChannelUseCaseProps } from './update.usecase';

jest.mock('@shared/domain/event/event-bus.model', () => ({ bus: { publish: jest.fn() } }));

describe('UpdateChannelUseCase', () => {
  let useCase: UpdateChannelUseCase;
  let mockChannelRepositoryService: Partial<jest.Mocked<BaseRepository<Channel>>>;
  let updatePrimitives: ChannelUpdatePrimitives;

  beforeEach(() => {
    mockChannelRepositoryService = { update: jest.fn() };
    useCase = new UpdateChannelUseCase(mockChannelRepositoryService as BaseRepository<Channel>);
    updatePrimitives = {
      currency: 'EUR',
      details: 'Updated IBAN: ES987654321',
      image: 'https://example.com/updated.jpg',
    };
  });

  it('should publish ChannelUpdated event and complete with success message on successful update', async () => {
    const originalChannel = ChannelMother.usd();
    const updatedChannel = Channel.from({
      ...originalChannel.toPrimitives(),
      ...updatePrimitives,
    });
    const props: UpdateChannelUseCaseProps = {
      channel: originalChannel,
      primitives: updatePrimitives,
    };

    mockChannelRepositoryService.update?.mockResolvedValue(E.right(updatedChannel));

    const result = await useCase['next'](props);

    expect(mockChannelRepositoryService.update).toHaveBeenCalledTimes(1);
    expect(bus.publish).toHaveBeenCalledWith(expect.objectContaining({ ...new ChannelUpdatedEvent(updatedChannel) }));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(updatedChannel)).build());
  });

  it('should complete with error message on failed update', async () => {
    const originalChannel = ChannelMother.euro();
    const exception = new Exception('Update channel failed');
    const props: UpdateChannelUseCaseProps = {
      channel: originalChannel,
      primitives: updatePrimitives,
    };

    mockChannelRepositoryService.update?.mockResolvedValue(E.left(exception));

    const result = await useCase['next'](props);

    expect(mockChannelRepositoryService.update).toHaveBeenCalledTimes(1);
    expect(bus.publish).toHaveBeenCalledWith(expect.objectContaining({ exception }));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.left(exception)).build());
  });

  it('should handle updating USD to COP channel', async () => {
    const originalChannel = ChannelMother.usd();
    const copUpdatePrimitives: ChannelUpdatePrimitives = {
      currency: 'COP',
      details: 'Nequi: 3001234567',
      image: 'https://example.com/cop-updated.jpg',
    };
    const updatedChannel = Channel.from({
      ...originalChannel.toPrimitives(),
      ...copUpdatePrimitives,
    });
    const props: UpdateChannelUseCaseProps = {
      channel: originalChannel,
      primitives: copUpdatePrimitives,
    };

    mockChannelRepositoryService.update?.mockResolvedValue(E.right(updatedChannel));

    const result = await useCase['next'](props);

    expect(mockChannelRepositoryService.update).toHaveBeenCalledTimes(1);
    expect(bus.publish).toHaveBeenCalledWith(expect.objectContaining({ ...new ChannelUpdatedEvent(updatedChannel) }));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(updatedChannel)).build());
  });

  it('should handle partial update of channel', async () => {
    const originalChannel = ChannelMother.cop();
    const partialUpdatePrimitives: Partial<ChannelUpdatePrimitives> = {
      details: 'Updated Bancolombia: 123456789',
    };
    const updatedChannel = Channel.from({
      ...originalChannel.toPrimitives(),
      ...partialUpdatePrimitives,
    });
    const props: UpdateChannelUseCaseProps = {
      channel: originalChannel,
      primitives: partialUpdatePrimitives,
    };

    mockChannelRepositoryService.update?.mockResolvedValue(E.right(updatedChannel));

    const result = await useCase['next'](props);

    expect(mockChannelRepositoryService.update).toHaveBeenCalledTimes(1);
    expect(bus.publish).toHaveBeenCalledWith(expect.objectContaining({ ...new ChannelUpdatedEvent(updatedChannel) }));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(updatedChannel)).build());
  });

  it('should handle updating random channel', async () => {
    const originalChannel = ChannelMother.random();
    const randomUpdatePrimitives: ChannelUpdatePrimitives = {
      currency: 'MXN',
      details: 'SPEI: 123456789012345678',
      image: 'https://example.com/mxn.jpg',
    };
    const updatedChannel = Channel.from({
      ...originalChannel.toPrimitives(),
      ...randomUpdatePrimitives,
    });
    const props: UpdateChannelUseCaseProps = {
      channel: originalChannel,
      primitives: randomUpdatePrimitives,
    };

    mockChannelRepositoryService.update?.mockResolvedValue(E.right(updatedChannel));

    const result = await useCase['next'](props);

    expect(mockChannelRepositoryService.update).toHaveBeenCalledTimes(1);
    expect(bus.publish).toHaveBeenCalledWith(expect.objectContaining({ ...new ChannelUpdatedEvent(updatedChannel) }));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(updatedChannel)).build());
  });
});
