import * as E from '@sweet-monads/either';
import { progressBuilder } from '@shared/application';
import { BaseRepository, EitherBuilder } from '@shared/domain';
import { Channel, ChannelUpdatePrimitives } from '@context/shared/domain';
import { AdminUseCase } from '../../../shared/application';
import { ChannelUpdatedEvent } from '../../domain';

export type UpdateChannelUseCaseProps = {
  channel: Channel;
  primitives: Partial<ChannelUpdatePrimitives>;
};

export class UpdateChannelUseCase extends AdminUseCase<UpdateChannelUseCaseProps, Promise<E.Either<void, void>>> {
  constructor(private readonly channelRepository: BaseRepository<Channel>) {
    super(
      progressBuilder().withStart('progress.updatingChannel').withComplete('progress.channelUpdatedSuccess').build()
    );
  }

  protected async next({ channel, primitives }: UpdateChannelUseCaseProps): Promise<E.Either<void, void>> {
    this.start();
    const updatedConfiguration = Channel.from({ ...channel.toPrimitives(), ...primitives });
    const result = await this.channelRepository.update(updatedConfiguration);
    result.mapRight((channel) => this.bus.publish(new ChannelUpdatedEvent(channel)));
    this.complete(result);
    return new EitherBuilder().fromEitherToVoid(result).build();
  }
}
