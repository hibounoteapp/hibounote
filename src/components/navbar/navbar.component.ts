import { Component, Renderer2 } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { ManagedElement, UINode } from '@jsplumb/browser-ui';
import { BoardDataService } from '../../services/board-data.service';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { IconService } from '../../services/icon.service';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

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
    private iconService: IconService,
    private iconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private router: Router,
  ) {
    iconService.registerIcons(iconRegistry, domSanitizer);
  }

  saveData() {
    this.boardData.saveData();
    this.router.navigate(['/account'])
  }
}
