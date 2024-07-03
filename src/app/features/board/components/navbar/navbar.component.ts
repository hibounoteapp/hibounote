import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { BoardService } from '../../../../shared/services/board/board.service';
import { BoardDataService } from '../../../../shared/services/board-data/board-data.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { IconService } from '@shared-services/icon/icon.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../../../account/components/edit-board-modal/components/delete-confirmation/delete-confirmation.component';
import { MatTooltip } from '@angular/material/tooltip';
import { SettingsModalComponent } from '../../../account/components/sidebar/components/modals/settings-modal/settings-modal.component';
import download from '@util-functions/download';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'navbar-component',
  standalone: true,
  imports: [RouterModule, MatIconModule, MatButtonModule, MatMenuModule, MatTooltip],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {



  constructor(
    public boardService: BoardService,
    public boardData: BoardDataService,
    public activeRoute: ActivatedRoute,
    private renderer: Renderer2,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private iconService: IconService,
    protected dialog: MatDialog,
    protected snackBar: MatSnackBar
  ) {

  }

  changeName(event: Event) {
    if(event.target instanceof HTMLInputElement) {
      const value = event.target.value
      this.boardData.editBoardName(this.boardData.activeId,value)
    }

  }

  saveData() {
    this.boardData.saveData();
    this.router.navigate(['/account'])
  }

  confirmDelete() {
    const dialog = this.dialog.open(DeleteConfirmationComponent)

    dialog.afterClosed().subscribe((result)=>{
      if(result==="DELETE") {
        this.boardData.deleteBoard(this.boardData.activeId);
        this.router.navigate(['/account']);
      }
    })
  }

  settingsModal() {
    const modalCookies = this.dialog.open(SettingsModalComponent);

    modalCookies.afterClosed().subscribe((result)=>{
    })
  }

  downloadBoard() {
    const board = this.boardData.getActiveBoard()
    if(board)
      download(JSON.stringify(board),board.name,'application/json','json')
  }

  saveAndDuplicate() {
    let board = this.boardData.getActiveBoard()
    if(!board) return;
    board.name = `${board.name} duplicate`
    this.boardData.saveData();
    this.boardData.createBoard(board,false);
    this.openSnackBar('Board created','Ok');
  }

  saveAndCreate() {
    this.boardData.saveData();
    this.boardData.createBoard(undefined,true)
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000
    });
  }

}
