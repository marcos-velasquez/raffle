import * as E from '@sweet-monads/either';
import { progressBuilder } from '@shared/application';
import { BaseRepository, EitherBuilder } from '@shared/domain';
import { AdminUseCase } from '../../../shared/application';
import { ConfigurationUpdatedEvent, Configuration, ConfigurationUpdatePrimitives } from '../../domain';

export type UpdateConfigurationUseCaseProps = {
  configuration: Configuration;
  primitives: Partial<ConfigurationUpdatePrimitives>;
};

export class UpdateConfigurationUseCase extends AdminUseCase<
  UpdateConfigurationUseCaseProps,
  Promise<E.Either<void, void>>
> {
  constructor(private readonly configurationRepository: BaseRepository<Configuration>) {
    super(
      progressBuilder()
        .withStart('progress.updatingConfiguration')
        .withComplete('progress.configurationUpdatedSuccess')
        .build()
    );
  }

  protected async next({ configuration, primitives }: UpdateConfigurationUseCaseProps): Promise<E.Either<void, void>> {
    this.start();
    const updatedConfiguration = Configuration.from({ ...configuration.toPrimitives(), ...primitives });
    const result = await this.configurationRepository.update(updatedConfiguration);
    result.mapRight((configuration) => this.bus.publish(new ConfigurationUpdatedEvent(configuration)));
    this.complete(result);
    return new EitherBuilder().fromEitherToVoid(result).build();
  }
}
