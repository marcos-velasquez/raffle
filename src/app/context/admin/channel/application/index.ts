import { PocketbaseChannelRepository } from '@context/shared/infrastructure';
import { CreateChannelUseCase, CreateChannelUseCaseProps } from './Create/create.usecase';
import { RemoveChannelUseCase, RemoveChannelUseCaseProps } from './Remove/remove.usecase';
import { UpdateChannelUseCase, UpdateChannelUseCaseProps } from './Update/update.usecase';

export class ChannelFacade {
  private readonly channelRepository = new PocketbaseChannelRepository();

  public create(props: CreateChannelUseCaseProps): void {
    new CreateChannelUseCase(this.channelRepository).execute(props);
  }

  public update(props: UpdateChannelUseCaseProps): void {
    new UpdateChannelUseCase(this.channelRepository).execute(props);
  }

  public remove(props: RemoveChannelUseCaseProps): void {
    new RemoveChannelUseCase(this.channelRepository).execute(props);
  }
}

export const channelFacade = new ChannelFacade();
