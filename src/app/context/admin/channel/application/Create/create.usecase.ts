import * as E from '@sweet-monads/either';
import { progressBuilder } from '@shared/application';
import { BaseRepository, EitherBuilder } from '@shared/domain';
import { Channel, ChannelCreatePrimitives } from '@context/shared/domain';
import { AdminUseCase } from '../../../shared/application';
import { ChannelCreatedEvent } from '../../domain';

export type CreateChannelUseCaseProps = ChannelCreatePrimitives;

export class CreateChannelUseCase extends AdminUseCase<CreateChannelUseCaseProps, Promise<E.Either<void, void>>> {
  constructor(private readonly channelRepository: BaseRepository<Channel>) {
    super(
      progressBuilder().withStart('progress.creatingChannel').withComplete('progress.channelCreatedSuccess').build()
    );
  }

  protected async next(props: CreateChannelUseCaseProps): Promise<E.Either<void, void>> {
    this.start();
    const result = await this.channelRepository.save(Channel.create(props));
    result.mapRight((channel) => this.bus.publish(new ChannelCreatedEvent(channel)));
    this.complete(result);
    return new EitherBuilder().fromEitherToVoid(result).build();
  }
}
