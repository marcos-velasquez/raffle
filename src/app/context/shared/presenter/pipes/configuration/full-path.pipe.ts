import { Pipe, PipeTransform } from '@angular/core';
import { FullPathPipe } from '@shared/presenter';
import { Configuration } from '@context/shared/domain';

@Pipe({ name: 'fullPath' })
export class ConfigurationFullPathPipe implements PipeTransform {
  transform(configuration: Configuration): string {
    return new FullPathPipe().transform('configuration', configuration.getId(), configuration.image);
  }
}
