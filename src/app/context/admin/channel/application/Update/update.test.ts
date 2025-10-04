import * as E from '@sweet-monads/either';
import { bus } from '@shared/domain/event/event-bus.model';
import { EitherBuilder } from '@shared/domain/either/either.builder';
import { BaseRepository, Exception } from '@shared/domain';
import { Channel, ConfigurationUpdatePrimitives } from '@context/shared/domain';
import { ConfigurationMother } from '@context/shared/domain/__tests__/builders/channel.mother.test';
import { ConfigurationUpdatedEvent } from '../../domain/channel.event';
import { UpdateConfigurationUseCase, UpdateConfigurationUseCaseProps } from './update.usecase';

jest.mock('@shared/domain/event/event-bus.model', () => ({ bus: { publish: jest.fn() } }));

describe('UpdateConfigurationUseCase', () => {
  let useCase: UpdateConfigurationUseCase;
  let mockConfigurationRepositoryService: Partial<jest.Mocked<BaseRepository<Channel>>>;
  let updatePrimitives: ConfigurationUpdatePrimitives;

  beforeEach(() => {
    mockConfigurationRepositoryService = { update: jest.fn() };
    useCase = new UpdateConfigurationUseCase(mockConfigurationRepositoryService as BaseRepository<Channel>);
    updatePrimitives = {
      currency: 'EUR',
      paymentDetails: 'Updated IBAN: ES987654321',
      image: 'https://example.com/updated.jpg',
    };
  });

  it('should publish ConfigurationUpdated event and complete with success message on successful update', async () => {
    const originalConfiguration = ConfigurationMother.usd();
    const updatedConfiguration = Channel.from({
      ...originalConfiguration.toPrimitives(),
      ...updatePrimitives,
    });
    const props: UpdateConfigurationUseCaseProps = {
      channel: originalConfiguration,
      primitives: updatePrimitives,
    };

    mockConfigurationRepositoryService.update?.mockResolvedValue(E.right(updatedConfiguration));

    const result = await useCase['next'](props);

    expect(mockConfigurationRepositoryService.update).toHaveBeenCalledTimes(1);
    expect(bus.publish).toHaveBeenCalledWith(
      expect.objectContaining({ ...new ConfigurationUpdatedEvent(updatedConfiguration) })
    );
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(updatedConfiguration)).build());
  });

  it('should complete with error message on failed update', async () => {
    const originalConfiguration = ConfigurationMother.euro();
    const exception = new Exception('Update channel failed');
    const props: UpdateConfigurationUseCaseProps = {
      channel: originalConfiguration,
      primitives: updatePrimitives,
    };

    mockConfigurationRepositoryService.update?.mockResolvedValue(E.left(exception));

    const result = await useCase['next'](props);

    expect(mockConfigurationRepositoryService.update).toHaveBeenCalledTimes(1);
    expect(bus.publish).toHaveBeenCalledWith(expect.objectContaining({ exception }));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.left(exception)).build());
  });

  it('should handle updating USD to COP channel', async () => {
    const originalConfiguration = ConfigurationMother.usd();
    const copUpdatePrimitives: ConfigurationUpdatePrimitives = {
      currency: 'COP',
      paymentDetails: 'Nequi: 3001234567',
      image: 'https://example.com/cop-updated.jpg',
    };
    const updatedConfiguration = Channel.from({
      ...originalConfiguration.toPrimitives(),
      ...copUpdatePrimitives,
    });
    const props: UpdateConfigurationUseCaseProps = {
      channel: originalConfiguration,
      primitives: copUpdatePrimitives,
    };

    mockConfigurationRepositoryService.update?.mockResolvedValue(E.right(updatedConfiguration));

    const result = await useCase['next'](props);

    expect(mockConfigurationRepositoryService.update).toHaveBeenCalledTimes(1);
    expect(bus.publish).toHaveBeenCalledWith(
      expect.objectContaining({ ...new ConfigurationUpdatedEvent(updatedConfiguration) })
    );
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(updatedConfiguration)).build());
  });

  it('should handle partial update of channel', async () => {
    const originalConfiguration = ConfigurationMother.cop();
    const partialUpdatePrimitives: Partial<ConfigurationUpdatePrimitives> = {
      paymentDetails: 'Updated Bancolombia: 123456789',
    };
    const updatedConfiguration = Channel.from({
      ...originalConfiguration.toPrimitives(),
      ...partialUpdatePrimitives,
    });
    const props: UpdateConfigurationUseCaseProps = {
      channel: originalConfiguration,
      primitives: partialUpdatePrimitives,
    };

    mockConfigurationRepositoryService.update?.mockResolvedValue(E.right(updatedConfiguration));

    const result = await useCase['next'](props);

    expect(mockConfigurationRepositoryService.update).toHaveBeenCalledTimes(1);
    expect(bus.publish).toHaveBeenCalledWith(
      expect.objectContaining({ ...new ConfigurationUpdatedEvent(updatedConfiguration) })
    );
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(updatedConfiguration)).build());
  });

  it('should handle updating random channel', async () => {
    const originalConfiguration = ConfigurationMother.random();
    const randomUpdatePrimitives: ConfigurationUpdatePrimitives = {
      currency: 'MXN',
      paymentDetails: 'SPEI: 123456789012345678',
      image: 'https://example.com/mxn.jpg',
    };
    const updatedConfiguration = Channel.from({
      ...originalConfiguration.toPrimitives(),
      ...randomUpdatePrimitives,
    });
    const props: UpdateConfigurationUseCaseProps = {
      channel: originalConfiguration,
      primitives: randomUpdatePrimitives,
    };

    mockConfigurationRepositoryService.update?.mockResolvedValue(E.right(updatedConfiguration));

    const result = await useCase['next'](props);

    expect(mockConfigurationRepositoryService.update).toHaveBeenCalledTimes(1);
    expect(bus.publish).toHaveBeenCalledWith(
      expect.objectContaining({ ...new ConfigurationUpdatedEvent(updatedConfiguration) })
    );
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(updatedConfiguration)).build());
  });
});
