import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { ConfigurationStore } from '../../../infrastructure/configuration.store';
import { ConfigurationCreatorComponent } from '../configuration-creator/configuration-creator.component';
import { ConfigurationCardComponent } from '../../components';

@Component({
  selector: 'app-configuration-list',
  imports: [CommonModule, TranslocoModule, ConfigurationCreatorComponent, ConfigurationCardComponent],
  templateUrl: './configuration-list.component.html',
})
export class ConfigurationListComponent {
  public readonly configurationStore = inject(ConfigurationStore);
}
