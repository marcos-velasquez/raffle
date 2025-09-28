import * as E from '@sweet-monads/either';
import { bus } from '@shared/domain/event/event-bus.model';
import { EitherBuilder } from '@shared/domain/either/either.builder';
import { BaseRepository, Exception } from '@shared/domain';
import { Configuration } from '@context/shared/domain';
import { ConfigurationMother } from '@context/shared/domain/__tests__/builders/configuration.mother.test';
import { ConfigurationCreatedEvent } from '../../domain';
import { CreateConfigurationUseCase, CreateConfigurationUseCaseProps } from './create.usecase';

jest.mock('@shared/domain/event/event-bus.model', () => ({ bus: { publish: jest.fn() } }));

describe('CreateConfigurationUseCase', () => {
  let useCase: CreateConfigurationUseCase;
  let mockConfigurationRepositoryService: Partial<jest.Mocked<BaseRepository<Configuration>>>;

  beforeEach(() => {
    mockConfigurationRepositoryService = { save: jest.fn() };
    useCase = new CreateConfigurationUseCase(mockConfigurationRepositoryService as BaseRepository<Configuration>);
  });

  it('should publish ConfigurationCreated event and complete with success message on successful create', async () => {
    const configuration = ConfigurationMother.usd();
    const props: CreateConfigurationUseCaseProps = {
      currency: configuration.currency,
      phonePrefix: configuration.phonePrefix,
      paymentDetails: configuration.paymentDetails,
      image: configuration.image,
    };
    mockConfigurationRepositoryService.save?.mockResolvedValue(E.right(configuration));

    const result = await useCase['next'](props);

    expect(mockConfigurationRepositoryService.save).toHaveBeenCalledTimes(1);
    expect(bus.publish).toHaveBeenCalledWith(new ConfigurationCreatedEvent(configuration));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(configuration)).build());
  });

  it('should complete with error message on failed create', async () => {
    const configuration = ConfigurationMother.euro();
    const props: CreateConfigurationUseCaseProps = {
      currency: configuration.currency,
      phonePrefix: configuration.phonePrefix,
      paymentDetails: configuration.paymentDetails,
      image: configuration.image,
    };
    const exception = new Exception('Create configuration failed');
    mockConfigurationRepositoryService.save?.mockResolvedValue(E.left(exception));

    const result = await useCase['next'](props);

    expect(mockConfigurationRepositoryService.save).toHaveBeenCalledTimes(1);
    expect(bus.publish).toHaveBeenCalledWith(expect.objectContaining({ exception }));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.left(exception)).build());
  });

  it('should handle different currency configurations', async () => {
    const configuration = ConfigurationMother.cop();
    const props: CreateConfigurationUseCaseProps = {
      currency: configuration.currency,
      phonePrefix: configuration.phonePrefix,
      paymentDetails: configuration.paymentDetails,
      image: configuration.image,
    };
    mockConfigurationRepositoryService.save?.mockResolvedValue(E.right(configuration));

    const result = await useCase['next'](props);

    expect(mockConfigurationRepositoryService.save).toHaveBeenCalledTimes(1);
    expect(bus.publish).toHaveBeenCalledWith(new ConfigurationCreatedEvent(configuration));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(configuration)).build());
  });

  it('should handle random configuration data', async () => {
    const configuration = ConfigurationMother.random();
    const props: CreateConfigurationUseCaseProps = {
      currency: configuration.currency,
      phonePrefix: configuration.phonePrefix,
      paymentDetails: configuration.paymentDetails,
      image: configuration.image,
    };
    mockConfigurationRepositoryService.save?.mockResolvedValue(E.right(configuration));

    const result = await useCase['next'](props);

    expect(mockConfigurationRepositoryService.save).toHaveBeenCalledTimes(1);
    expect(bus.publish).toHaveBeenCalledWith(new ConfigurationCreatedEvent(configuration));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(configuration)).build());
  });
});
