import { Component, Renderer2 } from '@angular/core';
import { BoardService } from '../../../../shared/services/board/board.service';
import { BoardDataService } from '../../../../shared/services/board-data/board-data.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'navbar-component',
  standalone: true,
  imports: [RouterModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  constructor(
    public boardService: BoardService,
    public boardData: BoardDataService,
    public activeRoute: ActivatedRoute,
    private renderer: Renderer2,
    private router: Router,
  ) {
  }

  saveData() {
    this.boardData.saveData();
    this.router.navigate(['/account'])
  }
}
