import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BaseComponent } from '@core/base';
import { SchemeComponent } from './tools/scheme/scheme.component';
import { AccountComponent } from './tools/account/account.component';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, SchemeComponent, AccountComponent],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent extends BaseComponent {}
