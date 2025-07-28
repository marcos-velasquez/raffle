import { computed, inject, Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Scheme, UiConfig } from '@ui/services/config';
import { when } from '@shared/domain';
import { LayoutObservable } from './observables/layout.observable';
import { SchemeObservable } from './observables/scheme.observable';

export type LayoutType = 'empty' | 'basic';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  public readonly layout = signal<LayoutType | undefined>(undefined);
  public readonly scheme = signal<Scheme | undefined>(undefined);

  private readonly document = inject(DOCUMENT);

  constructor(private readonly activatedRoute: ActivatedRoute) {
    inject(LayoutObservable).change$.subscribe((config) => this.updateLayout(config));
    inject(SchemeObservable).change$.subscribe((scheme) => this.updateScheme(scheme));
  }

  public is = computed(() => ({ empty: this.layout() === 'empty', basic: this.layout() === 'basic' }));

  private updateLayout(config: UiConfig): void {
    let route = this.activatedRoute;

    while (route.firstChild) {
      route = route.firstChild;
    }

    this.layout.set(config.layout as LayoutType);

    const paths = route.pathFromRoot;
    paths.forEach((path) => {
      if (path.routeConfig?.data?.['layout']) {
        this.layout.set(path.routeConfig?.data?.['layout']);
      }
    });
  }

  private updateScheme(scheme: Scheme): void {
    when(this.scheme.set(scheme)).map(() => this.document.documentElement.setAttribute('data-theme', scheme));
  }
}
