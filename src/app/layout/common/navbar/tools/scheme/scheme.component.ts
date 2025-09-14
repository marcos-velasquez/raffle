import { Component, OnInit, signal } from '@angular/core';
import { BaseComponent } from '@context/shared/presenter';
import { ConfigService } from '@ui/services/config';

@Component({
  selector: 'app-scheme',
  templateUrl: './scheme.component.html',
})
export class SchemeComponent extends BaseComponent implements OnInit {
  public readonly isDark = signal<boolean>(false);

  constructor(public readonly configService: ConfigService) {
    super();
  }

  ngOnInit(): void {
    this.configService.config$.pipe(this.unsubscribe()).subscribe(() => {
      this.isDark.set(this.configService.is.dark);
    });
  }

  public switchDark(): void {
    this.configService.switch.dark();
  }

  public switchLight(): void {
    this.configService.switch.light();
  }
}
