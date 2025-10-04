import { Component, inject, input, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { is, when } from '@shared/domain';
import { DialogComponent } from '@ui/components/dialog';
import { DropzoneComponent } from '@ui/components/dropzone';
import { ChannelFullPathPipe } from '@context/shared/presenter';
import { Channel } from '@context/shared/domain';
import { channelFacade } from '../../../application';

@Component({
  selector: 'app-channel-editor',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    DialogComponent,
    DropzoneComponent,
    ChannelFullPathPipe,
  ],
  templateUrl: './channel-editor.component.html',
})
export class ChannelEditorComponent {
  public readonly channel = input.required<Channel>();

  public readonly uiDialog = viewChild.required(DialogComponent);

  public form: FormGroup;

  constructor() {
    this.form = inject(FormBuilder).group({
      currency: ['', [Validators.required]],
      paymentDetails: ['', [Validators.required]],
      image: ['', [Validators.required]],
    });
  }

  public open() {
    when(this.form.patchValue(this.channel().toPrimitives())).map(() => this.uiDialog().open());
  }

  public close() {
    this.uiDialog().close();
  }

  public async update() {
    is.affirmative(this.form.valid)
      .mapLeft(() => this.form.markAllAsTouched())
      .mapRight(() => {
        when(channelFacade.update({ channel: this.channel(), primitives: this.form.value })).map(() => this.close());
      });
  }
}
