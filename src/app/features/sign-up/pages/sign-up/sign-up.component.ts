import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '@shared-components/navbar';
import { SimpleFormComponent } from '@shared-components/simple-form';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    RouterModule,
    SimpleFormComponent,
    NavbarComponent
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

}
