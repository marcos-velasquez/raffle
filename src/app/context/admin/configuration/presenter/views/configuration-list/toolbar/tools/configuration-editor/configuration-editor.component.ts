import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationEditorComponent as ImplementationRaffleEditorComponent } from '../../../../configuration-editor/configuration-editor.component';
import { Configuration } from '../../../../../../domain';

@Component({
  selector: 'app-configuration-editor-tool',
  imports: [CommonModule, ImplementationRaffleEditorComponent],
  templateUrl: './configuration-editor.component.html',
})
export class ConfigurationEditorComponent {
  public readonly configuration = input.required<Configuration>();
}
