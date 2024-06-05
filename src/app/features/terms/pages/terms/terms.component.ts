import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '@shared-components/footer';
import { NavbarComponent } from '@shared-components/navbar';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [
    RouterModule,
    FooterComponent,
    NavbarComponent
  ],
  templateUrl: './terms.component.html',
  styleUrl: './terms.component.scss'
})
export class TermsComponent {

}
