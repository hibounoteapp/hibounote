import { ChangeDetectionStrategy, Component, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogClose, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { IconService } from '@shared-services/icon/icon.service';
import { SettingsModalComponent } from './components/modals/settings-modal/settings-modal.component';
import { BoardDataService } from '@shared-services/board-data/board-data.service';
import { Board } from '@custom-interfaces/board';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'account-sidebar',
  standalone: true,
  imports: [RouterModule, MatIcon, MatDialogModule, MatTooltip],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  constructor(icon: IconService, protected dialog: MatDialog, protected renderer: Renderer2, protected boardData: BoardDataService){}

  settingsModal() {
    const modalCookies = this.dialog.open(SettingsModalComponent);

    modalCookies.afterClosed().subscribe((result)=>{
    })
  }

  uploadFile() {
    const input: HTMLInputElement = this.renderer.selectRootElement('#importJSON',true)
    input.click()
  }

  async createFromImport(event: Event) {
    if(!(event.target instanceof HTMLInputElement)) return
    if(!(event.target.files)) return;

    const object: Board = await this.parseJsonFile(event.target.files[0])

    this.boardData.createBoard(object)
  }

  async parseJsonFile(file: File): Promise<Board> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.onload = event => {
        if(event.target){
          resolve(JSON.parse(String(event.target.result)))
        }
      }
      fileReader.onerror = error => reject(error)
      fileReader.readAsText(file)
    })
  }

}
