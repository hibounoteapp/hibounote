import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
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

}
