import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { ChannelStore } from '@context/shared/infrastructure';
import { ChannelCreatorComponent } from '../channel-creator/channel-creator.component';
import { ChannelCardComponent } from '../../components';
import { ToolbarComponent } from './toolbar/toolbar.component';

@Component({
  selector: 'app-channel-list',
  imports: [CommonModule, TranslocoModule, ChannelCreatorComponent, ChannelCardComponent, ToolbarComponent],
  templateUrl: './channel-list.component.html',
})
export class ChannelListComponent {
  public readonly channelStore = inject(ChannelStore);
}
