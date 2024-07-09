import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CookiesModalComponent } from '../components/cookies-modal/cookies-modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CookiesService } from '@core-services/cookies/cookies.service';
import { UserDataService } from '@core-services/user-data/user-data.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, MatDialogModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  constructor(protected dialog: MatDialog, protected cookieService: CookiesService, public userData: UserDataService){}

  openModalCookies(){
    const modalCookies = this.dialog.open(CookiesModalComponent,{
      panelClass: "cookieModal"
    });

    modalCookies.afterClosed().subscribe((result)=>{
      this.cookieService.accepted = result === 'accept'
    })
  }
}
