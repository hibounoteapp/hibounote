import { Component, Renderer2 } from '@angular/core';
import { BoardDataService } from '../../services/board-data.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NodeService } from '../../services/node.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {
  constructor(
    public boardData: BoardDataService,
  ) {
  }

  createBoard() {
    this.boardData.createBoard()
  }
}
