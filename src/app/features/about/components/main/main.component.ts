import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IconService } from '@shared-services/icon/icon.service';

@Component({
  selector: 'about-main',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  constructor(iconService: IconService) {}
}
