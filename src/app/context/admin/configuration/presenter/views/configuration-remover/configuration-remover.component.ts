import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { ConfirmationService } from '@ui/services/confirmation';
import { Configuration } from '../../../domain';
import { configurationFacade } from '../../../application';

@Component({
  selector: 'app-configuration-remover',
  imports: [CommonModule, TranslocoModule],
  templateUrl: './configuration-remover.component.html',
})
export class ConfigurationRemoverComponent {
  public readonly configuration = input.required<Configuration>();

  private readonly confirmation = inject(ConfirmationService);

  public remove() {
    this.confirmation.open().mapRight(() => configurationFacade.remove(this.configuration()));
  }
}
