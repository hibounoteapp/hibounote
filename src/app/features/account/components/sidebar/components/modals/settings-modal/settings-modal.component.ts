import { Component } from '@angular/core';
import { MatDialogClose } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTab, MatTabsModule } from '@angular/material/tabs';
import { IconService } from '@shared-services/icon/icon.service';

@Component({
  selector: 'app-settings-modal',
  standalone: true,
  imports: [MatIcon, MatDialogClose, MatTab, MatTabsModule],
  templateUrl: './settings-modal.component.html',
  styleUrl: './settings-modal.component.scss'
})
export class SettingsModalComponent {
  constructor(icon: IconService){}

  closePopup(event: Event) {

  }
}
