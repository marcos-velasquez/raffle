import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { authenticationFacade } from '@context/admin/authentication/application';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  imports: [RouterModule, RouterLink, TranslocoPipe],
})
export class AccountComponent {
  public readonly router = inject(Router);

  public logout(): void {
    authenticationFacade.logout().then(() => this.router.navigate(['admin/authentication']));
  }
}
