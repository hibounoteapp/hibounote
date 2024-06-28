import { ChangeDetectionStrategy, Component, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogClose, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { IconService } from '@shared-services/icon/icon.service';
import { SettingsModalComponent } from './components/modals/settings-modal/settings-modal.component';
import { BoardDataService } from '@shared-services/board-data/board-data.service';
import { Board } from '@custom-interfaces/board';
import { MatTooltip } from '@angular/material/tooltip';
import { UserDataService } from '@core-services/user-data/user-data.service';
import { CommonModule } from '@angular/common';
import { MatMenu, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { EditBoardModalComponent } from '../edit-board-modal/edit-board-modal.component';
import { DeleteConfirmationComponent } from '../edit-board-modal/components/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'account-sidebar',
  standalone: true,
  imports: [RouterModule, MatIcon, MatDialogModule, MatTooltip, CommonModule, MatMenuModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnChanges{

  @Input() boardsData!: Board[];
  favBoards: Board[]=[];

  constructor(icon: IconService, protected dialog: MatDialog, protected renderer: Renderer2, protected boardData: BoardDataService, public userData: UserDataService){}

  settingsModal() {
    const modalCookies = this.dialog.open(SettingsModalComponent);

    modalCookies.afterClosed().subscribe((result)=>{
    })
  }

  uploadFile() {
    const input: HTMLInputElement = this.renderer.selectRootElement('#importJSON',true)
    input.click()
  }

  // createTag() {
  //   this.userData.createTag('Untitled')
  // }

  createFavorite() {
    this.boardData.createBoard({
      id: '',
      dateCreated: new Date(),
      name: 'Untitled Board',
      connetions: [],
      elements: [],
      groups: [],
      zoomScale: 1,
      favorite: true,
    })
  }

  // deleteTag(id: string) {
  //   this.userData.deleteTag(id);
  // }

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

  ngOnChanges(changes: SimpleChanges): void {
    this.favBoards = this.boardsData.filter((e)=>{
      return e.favorite
    })
  }

  toggleFavorite(id: string) {
    this.boardData.toggleFavorite(id);
  }

  confirmDelete(id: string) {
    const dialog = this.dialog.open(DeleteConfirmationComponent)

    dialog.afterClosed().subscribe((result)=>{
      if(result==="DELETE") {
        this.boardData.deleteBoard(id);
      }
    })
  }

  // openInputNameTag(event: Event) {
  //   const input:HTMLInputElement = this.renderer.selectRootElement('#inputNameTag',true)
  //   input.focus()
  //   event.stopPropagation();
  // }

  // closeInputNameTag(event: Event, menu: MatMenuTrigger, id: string) {
  //   if(!(event instanceof KeyboardEvent)) return

  //   if(event.key === 'Enter') {
  //     menu.closeMenu();
  //     this.userData.saveChanged(id)
  //   }
  // }

  editTag(event: Event, id:string) {
    if(!(event.target instanceof HTMLInputElement)) return

    this.userData.changeName(id,event.target.value)
  }

  editBoard(id: string) {
    const dialog = this.dialog.open(EditBoardModalComponent,{
      panelClass: "edit-modal",
      data:{id:id}
    });

    dialog.afterClosed().subscribe((result)=>{
      const {id, value} = result
      if(value === '') return;

      if(result.value === '$#DELETE#$') {
        this.boardData.deleteBoard(id);
        return
      }

      this.boardData.editBoardName(id,value)
    })
  }
}
