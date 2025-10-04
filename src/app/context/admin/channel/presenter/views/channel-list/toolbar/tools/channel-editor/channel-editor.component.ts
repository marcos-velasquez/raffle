import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Channel } from '@context/shared/domain';
import { ChannelEditorComponent as ImplementationChannelEditorComponent } from '../../../../channel-editor/channel-editor.component';

@Component({
  selector: 'app-channel-editor-tool',
  imports: [CommonModule, ImplementationChannelEditorComponent],
  templateUrl: './channel-editor.component.html',
})
export class ChannelEditorComponent {
  public readonly channel = input.required<Channel>();
}
