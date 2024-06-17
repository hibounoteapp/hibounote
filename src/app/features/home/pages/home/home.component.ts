import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '@shared-components/footer';
import { NavbarComponent } from '@shared-components/navbar';
import { SimpleButtonComponent } from '@shared-components/simple-button';
import { MainComponent } from '../../components/main/main.component';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    NavbarComponent,
    SimpleButtonComponent,
    FooterComponent,
    MainComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  showCookiesPopup: boolean = true;

  constructor(
    private cookieService: CookieService
  ){}
}
