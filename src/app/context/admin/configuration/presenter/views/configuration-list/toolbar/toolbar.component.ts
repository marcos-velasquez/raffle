import { Component, input } from '@angular/core';
import { Configuration } from '../../../../domain';
import { ConfigurationEditorComponent } from './tools/configuration-editor/configuration-editor.component';
import { ConfigurationRemoverComponent } from './tools/configuration-remover/configuration-remover.component';

@Component({
  selector: 'app-configuration-toolbar',
  imports: [ConfigurationEditorComponent, ConfigurationRemoverComponent],
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent {
  public readonly configuration = input.required<Configuration>();
}
