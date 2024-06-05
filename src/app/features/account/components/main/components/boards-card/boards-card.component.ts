import { Component, Renderer2 } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { BoardDataService } from '@shared-services/board-data/board-data.service';
import { BoardService } from '@shared-services/board/board.service';
import { MatDialog } from '@angular/material/dialog';
import { Board } from '@custom-interfaces/board';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'account-main-boardsCard',
  standalone: true,
  imports: [MatIconModule, RouterModule, CommonModule],
  templateUrl: './boards-card.component.html',
  styleUrl: './boards-card.component.scss'
})
export class BoardsCardComponent {
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
    // const dialog = this.dialog.open(DialogContent);

    // dialog.afterClosed().subscribe(result=>{
    //   console.log(result);
    // })
  }

  setSearch(event: Event) {
    if(event.target instanceof HTMLInputElement)
    this.input = event.target.value;
    this.filter();
  }
}
