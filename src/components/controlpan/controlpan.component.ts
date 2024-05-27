import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'controlpan-component',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './controlpan.component.html',
  styleUrl: './controlpan.component.scss'
})
export class ControlpanComponent {
  constructor(
    protected boardService: BoardService
  ) {

  }
}
