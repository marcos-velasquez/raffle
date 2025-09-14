import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { BaseComponent } from '@context/shared/presenter';
import { SchemeComponent } from './tools/scheme/scheme.component';
import { AccountComponent } from './tools/account/account.component';
import { LanguageComponent } from './tools/language/language.component';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, TranslocoPipe, SchemeComponent, AccountComponent, LanguageComponent],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent extends BaseComponent {}
