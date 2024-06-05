import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '@shared-components/navbar';
import { SimpleFormComponent } from '@shared-components/simple-form';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    RouterModule,
    SimpleFormComponent,
    NavbarComponent
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

}
