import { Component } from '@angular/core';
import { SimpleButtonComponent } from '@shared-components/simple-button';
import { HomeComponent } from '../../pages/home/home.component';
import { CookiesService } from '@core-services/cookies/cookies.service';

@Component({
  selector: 'home-cookies-popup',
  standalone: true,
  imports: [SimpleButtonComponent, HomeComponent],
  templateUrl: './cookies-popup.component.html',
  styleUrl: './cookies-popup.component.scss'
})
export class CookiesPopupComponent {

  closePopup(event: Event) {
    this.homeComponent.showCookiesPopup = false;
    if(event.target instanceof Element) {
      if(event.target.id === "decline") {
        this.declineCookies()
        return;
      }

      this.acceptCookies()
    }
  }

  acceptCookies(){
    console.log("Cookies accepted!")
    this.cookiesService.accepted = true;
  }

  declineCookies(){
    console.log("Cookies declined")
    this.cookiesService.accepted = false;
  }

  constructor(
    public homeComponent: HomeComponent,
    protected cookiesService : CookiesService
  ) {

  }
}
