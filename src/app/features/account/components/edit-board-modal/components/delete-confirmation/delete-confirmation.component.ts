import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { SimpleButtonComponent } from '@shared-components/simple-button';

@Component({
  selector: 'edit-modal-delete-confirmation',
  standalone: true,
  imports: [
    MatDialogModule,
    SimpleButtonComponent
  ],
  templateUrl: './delete-confirmation.component.html',
  styleUrl: './delete-confirmation.component.scss'
})
export class DeleteConfirmationComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {text:'string'}){}
}
