import { Component } from '@angular/core';
import { SimpleButtonComponent } from '@shared-components/simple-button';
import { HomeComponent } from '../../../../../features/home/pages/home/home.component';
import { CookiesService } from '@core-services/cookies/cookies.service';
import { FooterComponent } from '@shared-components/footer/footer/footer.component';
import { MatDialog, MatDialogActions, MatDialogClose, MatDialogModule } from '@angular/material/dialog';
import { IconService } from '@shared-services/icon/icon.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'footer-cookies-modal',
  standalone: true,
  imports: [SimpleButtonComponent, MatDialogModule, MatIconModule],
  templateUrl: './cookies-modal.component.html',
  styleUrl: './cookies-modal.component.scss'
})
export class CookiesModalComponent {
  closePopup(event: Event) {
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
    protected cookiesService : CookiesService,
    public matDialog: MatDialog,
    public iconService: IconService
  ) {

  }
}
