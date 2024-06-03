import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { BoardDataService } from '../../services/board-data.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NodeService } from '../../services/node.service';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { IconService } from '../../services/icon.service';
import { DomSanitizer } from '@angular/platform-browser';
import { BoardService } from '../../services/board.service';
import { Board } from '../../interfaces/board';
import {MatDialog, MatDialogModule, MatDialogConfig} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatDialogModule, MatTooltipModule],
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
    private iconService: IconService,
    private iconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private dialog: MatDialog,
  ) {

    iconService.registerIcons(iconRegistry,domSanitizer)
  }

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
    // if(!(event.target instanceof Element)) return;
    // let boardContainer;
    // if(event.target.parentElement?.tagName === 'BUTTON') {
    //   boardContainer = event.target.parentElement.parentElement;
    // } else {
    //   boardContainer = event.target.parentElement;
    // }
    // console.log(boardContainer)
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
