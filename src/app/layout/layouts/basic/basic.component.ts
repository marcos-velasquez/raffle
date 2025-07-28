import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../common/footer/footer.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';

@Component({
  selector: 'basic-layout',
  templateUrl: './basic.component.html',
  imports: [FooterComponent, NavbarComponent, RouterOutlet],
})
export class BasicLayoutComponent {}
