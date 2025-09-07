import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Exception } from '@shared/domain';
import { toast } from 'ngx-sonner';

@Injectable({ providedIn: 'root' })
export class SonnerToasterService {
  private waitId: string | number | undefined = undefined;

  constructor(private readonly translateService: TranslocoService) {}

  public success(message: string) {
    toast.success(this.translateService.translate(message));
  }

  public error(exception: Exception) {
    toast.error(this.translateService.translate(exception.message, exception.params));
  }

  public wait(message: string) {
    this.waitId = toast.loading(this.translateService.translate(message), { duration: Number.POSITIVE_INFINITY });
  }

  public disable() {
    toast.dismiss(this.waitId);
  }
}
