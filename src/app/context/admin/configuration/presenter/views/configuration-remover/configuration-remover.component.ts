import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { Configuration } from '../../../domain';
import { configurationFacade } from '../../../application';

@Component({
  selector: 'app-configuration-remover',
  imports: [CommonModule, TranslocoModule],
  templateUrl: './configuration-remover.component.html',
})
export class ConfigurationRemoverComponent {
  public readonly configuration = input.required<Configuration>();

  public isModalOpen = false;

  public openModal() {
    this.isModalOpen = true;
  }

  public closeModal() {
    this.isModalOpen = false;
  }

  public async onConfirm() {
    await configurationFacade.remove(this.configuration());
    this.closeModal();
  }
}
