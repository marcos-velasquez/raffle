import { Injectable } from '@angular/core';
import { toast } from 'ngx-sonner';

@Injectable({ providedIn: 'root' })
export class SonnerToasterService {
  private waitId: string | number | undefined = undefined;

  public success(message: string) {
    toast.success(message);
  }

  public error(message: string) {
    toast.error(message);
  }

  public wait(message: string) {
    this.waitId = toast.loading(message, { duration: Number.POSITIVE_INFINITY });
  }

  public dismissWait() {
    toast.dismiss(this.waitId);
  }
}
