import { Component, OnInit, Renderer2 } from '@angular/core';
import { BoardDataService } from '../../services/board-data.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NodeService } from '../../services/node.service';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { IconService } from '../../services/icon.service';
import { DomSanitizer } from '@angular/platform-browser';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent{
  constructor(
    public boardData: BoardDataService,
    private boardService: BoardService,
    private iconService: IconService,
    private iconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {

    iconService.registerIcons(iconRegistry,domSanitizer)
  }

  createBoard() {
    this.boardData.createBoard()
  }
}
