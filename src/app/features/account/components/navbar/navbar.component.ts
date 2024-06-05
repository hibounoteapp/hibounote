import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'account-navbar',
  standalone: true,
  imports: [
    RouterModule,
    MatIconModule,
    MatTooltip
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

}
