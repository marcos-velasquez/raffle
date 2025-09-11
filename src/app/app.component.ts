import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';
import { SplashScreenService } from '@ui/services/splash-screen';
import { BackButtonComponent } from '@ui/components/back-button';
import { AppSubscriber } from './app.subscriber';

@Component({
  imports: [RouterModule, NgxSonnerToaster, BackButtonComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [':host {display: flex; flex: 1 1 auto; width: 100%; height: 100%}'],
})
export class AppComponent {
  title = 'raffle';

  constructor() {
    inject(SplashScreenService).enable();
    inject(AppSubscriber).init();
  }
}
