import { Component, Renderer2 } from '@angular/core';
import { BoardDataService } from '../../../../shared/services/board-data/board-data.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BoardService } from '../../../../shared/services/board/board.service';
import { Board } from '../../../../core/models/interfaces/board';
import {MatDialog, MatDialogModule, MatDialogConfig} from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FooterComponent } from '@shared-components/footer';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { MainComponent } from '../../components/main/main.component';


@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    FooterComponent,
    NavbarComponent,
    MainComponent
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent{

  input: string = '';
  filteredBoards: Board[] = this.boardData.boards;

  constructor(
    public boardData: BoardDataService,
    private renderer: Renderer2,
    private boardService: BoardService,
    private dialog: MatDialog,
  ) {}

  createBoard() {
    this.boardData.createBoard()
  }

  filter() {
    if(this.input === '') {
      this.filteredBoards = this.boardData.boards
      return
    }
    const boards = [...this.boardData.boards];
    const newBoards = boards.filter((board)=>board.name.includes(this.input))
    this.filteredBoards = newBoards;
  }

  editBoard(event: Event, id: string) {
    const dialog = this.dialog.open(DialogContent);

    dialog.afterClosed().subscribe(result=>{
      console.log(result);
    })
  }

  setSearch(event: Event) {
    if(event.target instanceof HTMLInputElement)
    this.input = event.target.value;
    this.filter();
  }
}

@Component({
  selector: 'modal-editboard',
  template: `
  <h2>MODAL!!!1!</h2>

  <mat-dialog-actions align='end'>
    <button mat-dialog-close>Cancel</button>
    <button [mat-dialog-close]='true'>Confirm</button>
  </mat-dialog-actions>`,
  standalone: true,
  imports: [MatDialogModule]
})
export class DialogContent {}
