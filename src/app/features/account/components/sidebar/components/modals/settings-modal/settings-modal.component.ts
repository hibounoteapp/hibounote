import { Component } from '@angular/core';
import { MatDialog, MatDialogClose } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTab, MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { IconService } from '@shared-services/icon/icon.service';
import {MatSelectModule} from '@angular/material/select';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import { SimpleButtonComponent } from '@shared-components/simple-button';
import { DeleteConfirmationComponent } from '../../../../edit-board-modal/components/delete-confirmation/delete-confirmation.component';
import { BoardDataService } from '@shared-services/board-data/board-data.service';

@Component({
  selector: 'app-settings-modal',
  standalone: true,
  imports: [MatIcon, MatDialogClose, MatTab, MatTabsModule, RouterLink, MatSelectModule, MatFormField, MatFormFieldModule, SimpleButtonComponent],
  templateUrl: './settings-modal.component.html',
  styleUrl: './settings-modal.component.scss'
})
export class SettingsModalComponent {
  constructor(icon: IconService, protected dialog: MatDialog, protected boardData: BoardDataService){}

  confirmDelete() {
    const dialog = this.dialog.open(DeleteConfirmationComponent, {
      panelClass: '!max-w-[40vw]',
      data: {
        text: 'Are you sure you want to clean your board data? This action cannot be reversed.'
      }
    })

    dialog.afterClosed().subscribe((result)=>{
      if(result==="DELETE") {
        this.boardData.deleteAll().then(()=>{
          window.location.reload();
        })
      }
    })
  }
}
