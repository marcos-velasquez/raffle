import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'ui-back-button',
  imports: [CommonModule],
  templateUrl: './back-button.component.html',
})
export class BackButtonComponent {
  private readonly location = inject(Location);

  public get canGoBack(): boolean {
    return window.history.length > 1;
  }

  public goBack(): void {
    this.location.back();
  }
}
