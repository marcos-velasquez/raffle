import { Component, input } from '@angular/core';
import { Raffle } from '@context/shared/domain/raffle';
import { RaffleEditorComponent } from './tools/raffle-editor/raffle-editor.component';
import { RaffleRemoverComponent } from './tools/raffle-remover/raffle-remover.component';

@Component({
  selector: 'app-raffle-toolbar',
  imports: [RaffleEditorComponent, RaffleRemoverComponent],
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent {
  public readonly raffle = input.required<Raffle>();
}
