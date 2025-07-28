import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RaffleEditorComponent as ImplementationRaffleEditorComponent } from '@context/admin/raffle/presenter/views/raffle-editor/raffle-editor.component';
import { Raffle } from '@context/shared/domain/raffle';

@Component({
  selector: 'app-raffle-editor-tool',
  imports: [CommonModule, ImplementationRaffleEditorComponent],
  templateUrl: './raffle-editor.component.html',
})
export class RaffleEditorComponent {
  public readonly raffle = input.required<Raffle>();
}
