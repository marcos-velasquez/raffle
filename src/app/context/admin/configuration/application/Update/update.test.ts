import * as E from '@sweet-monads/either';
import { bus } from '@shared/domain/event/event-bus.model';
import { EitherBuilder } from '@shared/domain/either/either.builder';
import { BaseRepository, Exception } from '@shared/domain';
import { Configuration, ConfigurationUpdatePrimitives } from '../../domain';
import { ConfigurationUpdatedEvent } from '../../domain/configuration.event';
import { ConfigurationBuilder } from '../../domain/__tests__/configuration.builder.test';
import { ConfigurationMother } from '../../domain/__tests__/configuration.mother.test';
import { UpdateConfigurationUseCase, UpdateConfigurationUseCaseProps } from './update.usecase';

jest.mock('@shared/domain/event/event-bus.model', () => ({ bus: { publish: jest.fn() } }));

describe('UpdateConfigurationUseCase', () => {
  let useCase: UpdateConfigurationUseCase;
  let mockConfigurationRepositoryService: Partial<jest.Mocked<BaseRepository<Configuration>>>;
  let updatePrimitives: ConfigurationUpdatePrimitives;

  beforeEach(() => {
    mockConfigurationRepositoryService = { update: jest.fn() };
    useCase = new UpdateConfigurationUseCase(mockConfigurationRepositoryService as BaseRepository<Configuration>);
    updatePrimitives = {
      currency: 'EUR',
      phonePrefix: '+34',
      paymentDetails: 'Updated IBAN: ES987654321',
    };
  });

  it('should publish ConfigurationUpdated event and complete with success message on successful update', async () => {
    const originalConfiguration = ConfigurationMother.usd();
    const updatedConfiguration = Configuration.from({
      ...originalConfiguration.toPrimitives(),
      ...updatePrimitives,
    });
    const props: UpdateConfigurationUseCaseProps = {
      configuration: originalConfiguration,
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
    const exception = new Exception('Update configuration failed');
    const props: UpdateConfigurationUseCaseProps = {
      configuration: originalConfiguration,
      primitives: updatePrimitives,
    };

    mockConfigurationRepositoryService.update?.mockResolvedValue(E.left(exception));

    const result = await useCase['next'](props);

    expect(mockConfigurationRepositoryService.update).toHaveBeenCalledTimes(1);
    expect(bus.publish).toHaveBeenCalledWith(expect.objectContaining({ exception }));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.left(exception)).build());
  });

  it('should handle updating USD to COP configuration', async () => {
    const originalConfiguration = ConfigurationMother.usd();
    const copUpdatePrimitives: ConfigurationUpdatePrimitives = {
      currency: 'COP',
      phonePrefix: '+57',
      paymentDetails: 'Nequi: 3001234567',
    };
    const updatedConfiguration = Configuration.from({
      ...originalConfiguration.toPrimitives(),
      ...copUpdatePrimitives,
    });
    const props: UpdateConfigurationUseCaseProps = {
      configuration: originalConfiguration,
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

  it('should handle partial update of configuration', async () => {
    const originalConfiguration = ConfigurationBuilder.cop().build();
    const partialUpdatePrimitives: Partial<ConfigurationUpdatePrimitives> = {
      paymentDetails: 'Updated Bancolombia: 123456789',
    };
    const updatedConfiguration = Configuration.from({
      ...originalConfiguration.toPrimitives(),
      ...partialUpdatePrimitives,
    });
    const props: UpdateConfigurationUseCaseProps = {
      configuration: originalConfiguration,
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

  it('should handle updating random configuration', async () => {
    const originalConfiguration = ConfigurationMother.random();
    const randomUpdatePrimitives: ConfigurationUpdatePrimitives = {
      currency: 'MXN',
      phonePrefix: '+52',
      paymentDetails: 'SPEI: 123456789012345678',
    };
    const updatedConfiguration = Configuration.from({
      ...originalConfiguration.toPrimitives(),
      ...randomUpdatePrimitives,
    });
    const props: UpdateConfigurationUseCaseProps = {
      configuration: originalConfiguration,
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
