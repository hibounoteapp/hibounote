import { AfterViewInit, Component, EventEmitter, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import {SimpleButtonComponent} from '@shared-components/simple-button';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { IconService } from '@shared-services/icon/icon.service';
import { CommonModule } from '@angular/common';
import { Button } from '@custom-interfaces/button';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { SettingsModalComponent } from '../../../../features/account/components/sidebar/components/modals/settings-modal/settings-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, SimpleButtonComponent, MatSidenavModule, MatIconModule, CommonModule, MatMenuModule, MatMenu, MatTooltip],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent {
  @Input() fixed: boolean = true;
  @Input() buttons!: Button[];

  constructor(iconService: IconService){ }


}
