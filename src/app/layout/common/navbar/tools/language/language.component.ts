import { Component, OnInit, signal, computed } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { BaseComponent } from '@context/shared/presenter';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
})
export class LanguageComponent extends BaseComponent implements OnInit {
  public readonly currentLang = signal<string>('es');
  public readonly isSpanish = computed(() => this.currentLang() === 'es');

  constructor(private readonly translocoService: TranslocoService) {
    super();
  }

  ngOnInit(): void {
    this.translocoService.langChanges$.pipe(this.unsubscribe()).subscribe((lang) => {
      this.currentLang.set(lang);
    });
  }

  public switchToSpanish(): void {
    this.translocoService.setActiveLang('es');
  }

  public switchToEnglish(): void {
    this.translocoService.setActiveLang('en');
  }
}
