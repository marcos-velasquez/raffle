import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { Channel } from '@context/shared/domain';
import { ChannelFullPathPipe } from '@context/shared/presenter';

@Component({
  selector: 'app-channel-card',
  imports: [CommonModule, TranslocoModule, ChannelFullPathPipe],
  templateUrl: './channel-card.component.html',
})
export class ChannelCardComponent {
  public readonly channel = input.required<Channel>();
}
