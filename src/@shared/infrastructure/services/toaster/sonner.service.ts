import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { toast } from 'ngx-sonner';

@Injectable({ providedIn: 'root' })
export class SonnerToasterService {
  private waitId: string | number | undefined = undefined;

  constructor(private readonly translateService: TranslocoService) {}

  public success(message: string) {
    toast.success(this.translateService.translate(message));
  }

  public error(message: string) {
    toast.error(this.translateService.translate(message));
  }

  public wait(message: string) {
    this.waitId = toast.loading(this.translateService.translate(message), { duration: Number.POSITIVE_INFINITY });
  }

  public dismissWait() {
    toast.dismiss(this.waitId);
  }
}
