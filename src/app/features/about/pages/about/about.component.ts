import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '@shared-components/footer';
import { NavbarComponent } from '@shared-components/navbar';
import { MainComponent } from '../../components/main/main.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    RouterModule,
    FooterComponent,
    NavbarComponent,
    MainComponent
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {}
