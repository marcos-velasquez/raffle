import * as E from '@sweet-monads/either';
import { progressBuilder } from '@shared/application';
import { BaseRepository, EitherBuilder } from '@shared/domain';
import { Configuration, ConfigurationCreatePrimitives } from '@context/shared/domain';
import { AdminUseCase } from '../../../shared/application';
import { ConfigurationCreatedEvent } from '../../domain';

export type CreateConfigurationUseCaseProps = ConfigurationCreatePrimitives;

export class CreateConfigurationUseCase extends AdminUseCase<
  CreateConfigurationUseCaseProps,
  Promise<E.Either<void, void>>
> {
  constructor(private readonly configurationRepository: BaseRepository<Configuration>) {
    super(
      progressBuilder()
        .withStart('progress.creatingConfiguration')
        .withComplete('progress.configurationCreatedSuccess')
        .build()
    );
  }

  protected async next(props: CreateConfigurationUseCaseProps): Promise<E.Either<void, void>> {
    this.start();
    const result = await this.configurationRepository.save(Configuration.create(props));
    result.mapRight((configuration) => this.bus.publish(new ConfigurationCreatedEvent(configuration)));
    this.complete(result);
    return new EitherBuilder().fromEitherToVoid(result).build();
  }
}
