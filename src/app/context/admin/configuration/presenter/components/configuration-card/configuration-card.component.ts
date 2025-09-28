import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { Configuration } from '@context/shared/domain';
import { ConfigurationFullPathPipe } from '@context/shared/presenter';

@Component({
  selector: 'app-configuration-card',
  imports: [CommonModule, TranslocoModule, ConfigurationFullPathPipe],
  templateUrl: './configuration-card.component.html',
})
export class ConfigurationCardComponent {
  public readonly configuration = input.required<Configuration>();
}
