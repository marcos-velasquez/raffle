import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseComponent } from '@core/base';
import { is } from '@shared/domain';
import { authenticationFacade } from '../../../application';

@Component({
  selector: 'login',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent extends BaseComponent {
  public readonly form: FormGroup;

  constructor(private readonly router: Router) {
    super();
    this.form = inject(FormBuilder).group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  public login() {
    is.affirmative(this.form.valid)
      .mapLeft(() => this.form.markAllAsTouched())
      .mapRight(() => {
        authenticationFacade
          .login(this.form.getRawValue())
          .then((result) => result.mapRight(() => this.router.navigate(['/admin/raffle'])));
      });
  }
}
