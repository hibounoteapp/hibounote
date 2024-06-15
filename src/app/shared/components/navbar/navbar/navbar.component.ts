import { AfterViewInit, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import {SimpleButtonComponent} from '@shared-components/simple-button';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { IconService } from '@shared-services/icon/icon.service';
import { CommonModule } from '@angular/common';

interface Button {
  visible: boolean,
  theme: 'btn-primary' | 'btn-secondary'
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, SimpleButtonComponent, MatSidenavModule, MatIconModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent {
  @Input() fixed: boolean = true;
  @Input() loginButton!: Button;
  @Input() signupButton!: Button;
  @Input() accountButton!: Button;

  constructor(iconService: IconService){

  }
}
