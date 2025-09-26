import * as E from '@sweet-monads/either';
import { progressBuilder } from '@shared/application';
import { BaseRepository, EitherBuilder } from '@shared/domain';
import { AdminUseCase } from '../../../shared/application';
import { ConfigurationRemovedEvent, Configuration } from '../../domain';

export type RemoveConfigurationUseCaseProps = Configuration;

export class RemoveConfigurationUseCase extends AdminUseCase<
  RemoveConfigurationUseCaseProps,
  Promise<E.Either<void, void>>
> {
  constructor(private readonly configurationRepository: BaseRepository<Configuration>) {
    super(
      progressBuilder()
        .withStart('progress.removingConfiguration')
        .withComplete('progress.configurationRemovedSuccess')
        .build()
    );
  }

  protected async next(props: RemoveConfigurationUseCaseProps): Promise<E.Either<void, void>> {
    this.start();
    const result = await this.configurationRepository.remove(props);
    result.mapRight((configuration) => this.bus.publish(new ConfigurationRemovedEvent(configuration)));
    this.complete(result);
    return new EitherBuilder().fromEitherToVoid(result).build();
  }
}
