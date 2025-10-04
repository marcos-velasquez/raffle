import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from '@ui/services/confirmation';
import { Channel } from '@context/shared/domain';
import { channelFacade } from '../../../../../../application';

@Component({
  selector: 'app-channel-remover-tool',
  imports: [CommonModule],
  templateUrl: './channel-remover.component.html',
})
export class ConfigurationRemoverComponent {
  public readonly channel = input.required<Channel>();

  private readonly confirmation = inject(ConfirmationService);

  public remove() {
    this.confirmation.open().mapRight(() => channelFacade.remove(this.channel()));
  }
}
