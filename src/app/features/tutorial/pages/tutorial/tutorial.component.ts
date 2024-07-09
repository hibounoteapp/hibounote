import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '@shared-components/footer';
import { NavbarComponent } from '@shared-components/navbar';
import { FeatureCardComponent } from '../../components/feature-card/feature-card.component';
import { TutorialService } from '../../services/tutorial/tutorial.service';
import { CommonModule } from '@angular/common';
import { UserDataService } from '@core-services/user-data/user-data.service';

@Component({
  selector: 'app-tutorial',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatTooltipModule,
    FooterComponent,
    NavbarComponent,
    FeatureCardComponent],
  templateUrl: './tutorial.component.html',
  styleUrl: './tutorial.component.scss'
})
export class TutorialComponent {
  constructor(protected tutorialService: TutorialService, public userData: UserDataService) {}
}
