import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Raffle } from '@context/shared/domain/raffle';
import { RaffleEditorComponent as ImplementationRaffleEditorComponent } from '../../../../raffle-editor/raffle-editor.component';

@Component({
  selector: 'app-raffle-editor-tool',
  imports: [CommonModule, ImplementationRaffleEditorComponent],
  templateUrl: './raffle-editor.component.html',
})
export class RaffleEditorComponent {
  public readonly raffle = input.required<Raffle>();
}
