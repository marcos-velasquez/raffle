import { Component, input } from '@angular/core';
import { Channel } from '@context/shared/domain';
import { ConfigurationEditorComponent } from './tools/channel-editor/channel-editor.component';
import { ConfigurationRemoverComponent } from './tools/channel-remover/configuration-remover.component';

@Component({
  selector: 'app-channel-toolbar',
  imports: [ConfigurationEditorComponent, ConfigurationRemoverComponent],
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent {
  public readonly channel = input.required<Channel>();
}
