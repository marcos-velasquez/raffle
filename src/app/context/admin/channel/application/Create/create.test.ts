import * as E from '@sweet-monads/either';
import { bus } from '@shared/domain/event/event-bus.model';
import { EitherBuilder } from '@shared/domain/either/either.builder';
import { BaseRepository, Exception } from '@shared/domain';
import { Channel } from '@context/shared/domain';
import { ConfigurationMother } from '@context/shared/domain/__tests__/builders/channel.mother.test';
import { ConfigurationCreatedEvent } from '../../domain';
import { CreateConfigurationUseCase, CreateConfigurationUseCaseProps } from './create.usecase';

jest.mock('@shared/domain/event/event-bus.model', () => ({ bus: { publish: jest.fn() } }));

describe('CreateConfigurationUseCase', () => {
  let useCase: CreateConfigurationUseCase;
  let mockConfigurationRepositoryService: Partial<jest.Mocked<BaseRepository<Channel>>>;

  beforeEach(() => {
    mockConfigurationRepositoryService = { save: jest.fn() };
    useCase = new CreateConfigurationUseCase(mockConfigurationRepositoryService as BaseRepository<Channel>);
  });

  it('should publish ConfigurationCreated event and complete with success message on successful create', async () => {
    const channel = ConfigurationMother.usd();
    const props: CreateConfigurationUseCaseProps = {
      currency: channel.currency,
      paymentDetails: channel.paymentDetails,
      image: channel.image,
    };
    mockConfigurationRepositoryService.save?.mockResolvedValue(E.right(channel));

    const result = await useCase['next'](props);

    expect(mockConfigurationRepositoryService.save).toHaveBeenCalledTimes(1);
    expect(bus.publish).toHaveBeenCalledWith(new ConfigurationCreatedEvent(channel));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(channel)).build());
  });

  it('should complete with error message on failed create', async () => {
    const channel = ConfigurationMother.euro();
    const props: CreateConfigurationUseCaseProps = {
      currency: channel.currency,
      paymentDetails: channel.paymentDetails,
      image: channel.image,
    };
    const exception = new Exception('Create channel failed');
    mockConfigurationRepositoryService.save?.mockResolvedValue(E.left(exception));

    const result = await useCase['next'](props);

    expect(mockConfigurationRepositoryService.save).toHaveBeenCalledTimes(1);
    expect(bus.publish).toHaveBeenCalledWith(expect.objectContaining({ exception }));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.left(exception)).build());
  });

  it('should handle different currency configurations', async () => {
    const channel = ConfigurationMother.cop();
    const props: CreateConfigurationUseCaseProps = {
      currency: channel.currency,
      paymentDetails: channel.paymentDetails,
      image: channel.image,
    };
    mockConfigurationRepositoryService.save?.mockResolvedValue(E.right(channel));

    const result = await useCase['next'](props);

    expect(mockConfigurationRepositoryService.save).toHaveBeenCalledTimes(1);
    expect(bus.publish).toHaveBeenCalledWith(new ConfigurationCreatedEvent(channel));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(channel)).build());
  });

  it('should handle random channel data', async () => {
    const channel = ConfigurationMother.random();
    const props: CreateConfigurationUseCaseProps = {
      currency: channel.currency,
      paymentDetails: channel.paymentDetails,
      image: channel.image,
    };
    mockConfigurationRepositoryService.save?.mockResolvedValue(E.right(channel));

    const result = await useCase['next'](props);

    expect(mockConfigurationRepositoryService.save).toHaveBeenCalledTimes(1);
    expect(bus.publish).toHaveBeenCalledWith(new ConfigurationCreatedEvent(channel));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(channel)).build());
  });
});
