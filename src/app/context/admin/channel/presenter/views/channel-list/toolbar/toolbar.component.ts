import { Component, input } from '@angular/core';
import { Channel } from '@context/shared/domain';
import { ChannelEditorComponent } from './tools/channel-editor/channel-editor.component';
import { ChannelRemoverComponent } from './tools/channel-remover/channel-remover.component';

@Component({
  selector: 'app-channel-toolbar',
  imports: [ChannelEditorComponent, ChannelRemoverComponent],
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent {
  public readonly channel = input.required<Channel>();
}
