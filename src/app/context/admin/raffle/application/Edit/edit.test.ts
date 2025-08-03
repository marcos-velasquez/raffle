import * as E from '@sweet-monads/either';
import { bus } from '@shared/domain/event/event-bus.model';
import { EitherBuilder } from '@shared/domain/either/either.builder';
import { BaseRepository } from '@shared/domain';
import { RaffleBuilder } from '@context/shared/domain/__tests__/builders/raffle.builder.test';
import { Raffle, RaffleEditPrimitives } from '@context/shared/domain/raffle';
import { RaffleEditedEvent } from '../../domain/raffle.event';
import { EditRaffleUseCase } from './edit.usecase';

jest.mock('@shared/domain/event/event-bus.model', () => ({ bus: { publish: jest.fn() } }));

describe('EditRaffleUseCase', () => {
  let useCase: EditRaffleUseCase;
  let mockRaffleRepositoryService: Partial<jest.Mocked<BaseRepository<Raffle>>>;
  let primitives: RaffleEditPrimitives;

  beforeEach(() => {
    mockRaffleRepositoryService = { update: jest.fn() };
    useCase = new EditRaffleUseCase(mockRaffleRepositoryService as BaseRepository<Raffle>);
    primitives = { title: 'Update title', description: 'Update description', images: ['update.jpg'], price: 1000 };
  });

  it('should publish RaffleEdited event and complete with success message on successful edit', async () => {
    const raffle = new RaffleBuilder().build();
    const editedRaffle = Raffle.from({ ...raffle.toPrimitives(), ...primitives, id: expect.anything() });

    mockRaffleRepositoryService.update?.mockResolvedValue(E.right(editedRaffle));

    const result = await useCase['next']({ raffle, primitives });

    expect(mockRaffleRepositoryService.update).toHaveBeenCalledTimes(1);
    expect(mockRaffleRepositoryService.update).toHaveBeenCalledWith(expect.objectContaining(editedRaffle));
    expect(bus.publish).toHaveBeenCalledWith(expect.objectContaining({ ...new RaffleEditedEvent(editedRaffle) }));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.right(editedRaffle)).build());
  });

  it('should complete with error message on failed edit', async () => {
    const raffle = new RaffleBuilder().build();
    const error = new Error('Edit raffle failed');
    mockRaffleRepositoryService.update?.mockResolvedValue(E.left(error));

    const result = await useCase['next']({ raffle, primitives });

    expect(mockRaffleRepositoryService.update).toHaveBeenCalledTimes(1);
    expect(mockRaffleRepositoryService.update).toHaveBeenCalledWith(
      expect.objectContaining({ ...Raffle.from({ ...raffle.toPrimitives(), ...primitives }), id: expect.anything() })
    );
    expect(raffle.toPrimitives()).not.toEqual(expect.objectContaining({ ...primitives }));
    expect(bus.publish).toHaveBeenCalledWith(expect.objectContaining({ error: error }));
    expect(result).toEqual(new EitherBuilder().fromEitherToVoid(E.left(error)).build());
  });

  it('should complete with error message on failed edit price in purchased raffle', async () => {
    const raffle = new RaffleBuilder().withNumber(1).state('purchased').build();

    await expect(() => useCase['next']({ raffle, primitives: { ...primitives, price: 555 } })).rejects.toThrow();
    expect(mockRaffleRepositoryService.update).not.toHaveBeenCalled();
  });

  it('should complete without error message on edit price = price in purchased raffle', async () => {
    const raffle = new RaffleBuilder().withNumber(1).state('purchased').withPrice(primitives.price).build();
    mockRaffleRepositoryService.update?.mockResolvedValue(E.right(raffle));

    await expect(useCase['next']({ raffle, primitives })).resolves.not.toThrow();
    expect(mockRaffleRepositoryService.update).toHaveBeenCalled();
  });

  it('should complete without error message on edit price = price in not purchased raffle', async () => {
    const raffle = new RaffleBuilder().withPrice(primitives.price).build();
    mockRaffleRepositoryService.update?.mockResolvedValue(E.right(raffle));

    await expect(useCase['next']({ raffle, primitives })).resolves.not.toThrow();
    expect(mockRaffleRepositoryService.update).toHaveBeenCalled();
  });
});
