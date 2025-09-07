import { Component, ElementRef, inject, input, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { delay, tap } from 'rxjs';
import { TranslocoPipe } from '@jsverse/transloco';
import { convert } from '@shared/domain';
import { DialogComponent } from '@ui/components/dialog';
import { RouletteService } from '@ui/services/roulette';
import { ConfettiService } from '@ui/services/confetti';
import { recording } from '@ui/services/recorder';
import { Raffle } from '@context/shared/domain/raffle';
import { NumberDetailsComponent } from '@context/shared/presenter';
import { Label } from '@context/admin/roulette/domain';
import { historyFacade } from '@context/admin/history/application';
import { rouletteFacade } from '@context/admin/roulette/application';

@Component({
  selector: 'app-roulette',
  imports: [CommonModule, TranslocoPipe, DialogComponent, NumberDetailsComponent],
  templateUrl: './roulette.component.html',
  styles: [':host { display:block; }'],
})
export class RouletteComponent {
  public readonly raffle = input.required<Raffle>();

  private readonly winnerDialog = viewChild.required(DialogComponent);
  private readonly rouletteRef = viewChild.required<ElementRef<HTMLElement>>('rouletteRef');

  private readonly confettiService = inject(ConfettiService);

  constructor(private readonly rouletteService: RouletteService) {}

  ngOnInit() {
    this.rouletteService.props = { el: this.rouletteRef().nativeElement, labels: Label.many(this.raffle()) };
  }

  public spin() {
    recording((recorder) => {
      this.rouletteService
        .spin()
        .pipe(
          tap((value) => rouletteFacade.selectWinner({ raffle: this.raffle(), value: ++value })),
          delay(convert.seg(1).to.ms()),
          tap(() => this.winnerDialog().open()),
          tap(() => this.confettiService.start()),
          delay(convert.seg(2).to.ms())
        )
        .subscribe(() => {
          recorder.stop().then(({ file }) => {
            historyFacade.create({ file: file(this.raffle().title), raffle: this.raffle().toPrimitives() });
          });
        });
    });
  }

  public onDestroy() {
    this.rouletteService.destroy();
  }
}
