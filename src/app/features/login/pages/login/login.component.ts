import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '@shared-components/navbar';
import { SimpleFormComponent } from '@shared-components/simple-form';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, NavbarComponent, SimpleFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

}
