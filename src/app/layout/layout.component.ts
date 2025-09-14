import { Component, inject, ViewEncapsulation } from '@angular/core';
import { BaseComponent } from '@context/shared/presenter';
import { LoadingBarComponent } from '@ui/components/loading-bar';
import { LayoutService } from './services/layout.service';
import { EmptyLayoutComponent } from './layouts/empty/empty.component';
import { BasicLayoutComponent } from './layouts/basic/basic.component';

@Component({
  selector: 'layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  encapsulation: ViewEncapsulation.None,
  imports: [EmptyLayoutComponent, BasicLayoutComponent, LoadingBarComponent],
})
export class LayoutComponent extends BaseComponent {
  public readonly layoutService = inject(LayoutService);
}
