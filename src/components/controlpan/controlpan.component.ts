import { Component } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'controlpan-component',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './controlpan.component.html',
  styleUrl: './controlpan.component.scss'
})
export class ControlpanComponent {
  constructor(
    protected boardService: BoardService
  ) {

  }
}
