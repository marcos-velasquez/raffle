import * as E from '@sweet-monads/either';
import { progressBuilder } from '@shared/application';
import { BaseRepository, EitherBuilder } from '@shared/domain';
import { Channel } from '@context/shared/domain';
import { AdminUseCase } from '../../../shared/application';
import { ChannelRemovedEvent } from '../../domain';

export type RemoveChannelUseCaseProps = Channel;

export class RemoveChannelUseCase extends AdminUseCase<RemoveChannelUseCaseProps, Promise<E.Either<void, void>>> {
  constructor(private readonly channelRepository: BaseRepository<Channel>) {
    super(
      progressBuilder().withStart('progress.removingChannel').withComplete('progress.channelRemovedSuccess').build()
    );
  }

  protected async next(props: RemoveChannelUseCaseProps): Promise<E.Either<void, void>> {
    this.start();
    const result = await this.channelRepository.remove(props);
    result.mapRight((channel) => this.bus.publish(new ChannelRemovedEvent(channel)));
    this.complete(result);
    return new EitherBuilder().fromEitherToVoid(result).build();
  }
}
