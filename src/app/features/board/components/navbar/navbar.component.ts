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

@Component({
  selector: 'navbar-component',
  standalone: true,
  imports: [RouterModule, MatIconModule, MatButtonModule, MatMenuModule],
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
    private iconService: IconService
  ) {

  }

  changeName(event: Event) {
    if(event.target instanceof HTMLInputElement) {
      const value = event.target.value
      this.boardData.editBoardName(this.boardData.activeId,value)
    }

  }

  deleteBoard() {
    //!Confirmation
    this.boardData.deleteBoard(this.boardData.activeId)
    this.router.navigate(['/account'])
  }

  saveData() {
    this.boardData.saveData();
    this.router.navigate(['/account'])
  }


}
