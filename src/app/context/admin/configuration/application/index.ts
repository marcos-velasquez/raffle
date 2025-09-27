import { PocketbaseConfigurationRepository } from '@context/shared/infrastructure';
import { CreateConfigurationUseCase, CreateConfigurationUseCaseProps } from './Create/create.usecase';
import { RemoveConfigurationUseCase, RemoveConfigurationUseCaseProps } from './Remove/remove.usecase';
import { UpdateConfigurationUseCase, UpdateConfigurationUseCaseProps } from './Update/update.usecase';

export class ConfigurationFacade {
  private readonly configurationRepository = new PocketbaseConfigurationRepository();

  public create(props: CreateConfigurationUseCaseProps): void {
    new CreateConfigurationUseCase(this.configurationRepository).execute(props);
  }

  public update(props: UpdateConfigurationUseCaseProps): void {
    new UpdateConfigurationUseCase(this.configurationRepository).execute(props);
  }

  public remove(props: RemoveConfigurationUseCaseProps): void {
    new RemoveConfigurationUseCase(this.configurationRepository).execute(props);
  }
}

export const configurationFacade = new ConfigurationFacade();
