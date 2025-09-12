import * as E from '@sweet-monads/either';
import { bus } from '@shared/domain/event/event-bus.model';
import { EitherBuilder } from '@shared/domain/either/either.builder';
import { BaseRepository, Exception } from '@shared/domain';
import { RaffleBuilder } from '@context/shared/domain/__tests__/builders/raffle.builder.test';
import { Raffle, RaffleUpdatePrimitives } from '@context/shared/domain/raffle';
import { RaffleUpdatedEvent } from '../../domain';
import { UpdateRaffleUseCase } from './update.usecase';

jest.mock('@shared/domain/event/event-bus.model', () => ({ bus: { publish: jest.fn() } }));

describe('UpdateRaffleUseCase', () => {
  let useCase: UpdateRaffleUseCase;
  let mockRaffleRepositoryService: Partial<jest.Mocked<BaseRepository<Raffle>>>;
  let primitives: RaffleUpdatePrimitives;

  beforeEach(() => {
    mockRaffleRepositoryService = { update: jest.fn() };
    useCase = new UpdateRaffleUseCase(mockRaffleRepositoryService as BaseRepository<Raffle>);
    primitives = { title: 'Update title', description: 'Update description', images: ['update.jpg'], price: 1000 };
  });

  it('should publish RaffleUpdateed event and complete with success message on successful update', async () => {
    const raffle = new RaffleBuilder().build();
    const updatedRaffle = Raffle.from({ ...raffle.toPrimitives(), ...primitives, id: expect.anything() });

    mockRaffleRepositoryService.update?.mockResolvedValue(E.right(updatedRaffle));

    const result = await useCase['next']({ raffle, primitives });

    expect(mockRaffleRepositoryService.update).toHaveBeenCalledTimes(1);
    expect(bus.publish).toHaveBeenCalledWith(expect.objectContaining({ ...new RaffleUpdatedEvent(updatedRaffle) }));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(updatedRaffle)).build());
  });

  it('should complete with error message on failed update', async () => {
    const raffle = new RaffleBuilder().build();
    const exception = new Exception('update raffle failed');
    mockRaffleRepositoryService.update?.mockResolvedValue(E.left(exception));

    const result = await useCase['next']({ raffle, primitives });

    expect(mockRaffleRepositoryService.update).toHaveBeenCalledTimes(1);
    expect(raffle.toPrimitives()).not.toEqual(expect.objectContaining({ ...primitives }));
    expect(bus.publish).toHaveBeenCalledWith(expect.objectContaining({ exception }));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.left(exception)).build());
  });

  it('should complete with error message on failed update price in purchased raffle', async () => {
    const raffle = new RaffleBuilder().withNumber(1).state('purchased').build();

    await expect(() => useCase['next']({ raffle, primitives: { ...primitives, price: 555 } }));

    expect(mockRaffleRepositoryService.update).not.toHaveBeenCalled();
  });

  it('should complete without error message on update price = price in purchased raffle', async () => {
    const raffle = new RaffleBuilder().withNumber(1).state('purchased').withPrice(primitives.price).build();
    mockRaffleRepositoryService.update?.mockResolvedValue(E.right(raffle));

    await expect(useCase['next']({ raffle, primitives })).resolves.not.toThrow();
    expect(mockRaffleRepositoryService.update).toHaveBeenCalled();
  });

  it('should complete without error message on update price = price in not purchased raffle', async () => {
    const raffle = new RaffleBuilder().withPrice(primitives.price).build();
    mockRaffleRepositoryService.update?.mockResolvedValue(E.right(raffle));

    await expect(useCase['next']({ raffle, primitives })).resolves.not.toThrow();
    expect(mockRaffleRepositoryService.update).toHaveBeenCalled();
  });
});
