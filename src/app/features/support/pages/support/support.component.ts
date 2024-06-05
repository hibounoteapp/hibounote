import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '@shared-components/footer';
import { NavbarComponent } from '@shared-components/navbar';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [
    RouterModule,
    FooterComponent,
    NavbarComponent
  ],
  templateUrl: './support.component.html',
  styleUrl: './support.component.scss'
})
export class SupportComponent {

}
