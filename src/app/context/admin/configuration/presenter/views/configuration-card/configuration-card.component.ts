import { Component, input, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { Configuration } from '../../../domain';
import { ConfigurationEditorComponent } from '../configuration-editor/configuration-editor.component';
import { ConfigurationRemoverComponent } from '../configuration-remover/configuration-remover.component';

@Component({
  selector: 'app-configuration-card',
  imports: [CommonModule, TranslocoModule, ConfigurationEditorComponent, ConfigurationRemoverComponent],
  templateUrl: './configuration-card.component.html',
})
export class ConfigurationCardComponent {
  public readonly configuration = input.required<Configuration>();
}
