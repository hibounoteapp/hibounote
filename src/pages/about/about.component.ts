import { Component } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { IconService } from '../../services/icon.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterModule, MatIconModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  constructor(
    private iconRegistry: MatIconRegistry,
    private iconService: IconService,
    private domSanitizer: DomSanitizer
  ) {
    iconService.registerIcons(iconRegistry,domSanitizer);
  }
}
