import { AfterViewInit, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import {SimpleButtonComponent} from '@shared-components/simple-button';

interface Button {
  visible: boolean,
  theme: 'btn-primary' | 'btn-secondary'
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, SimpleButtonComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent {
  @Input() fixed: boolean = true;
  @Input() loginButton!: Button;
  @Input() signupButton!: Button;
  @Input() accountButton!: Button;
}
