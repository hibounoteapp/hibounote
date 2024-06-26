import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TemplateCardComponent } from './components/template-card/template-card.component';
import { BoardsContainerComponent } from './components/boards-container/boards-container.component';
import { BoardDataService } from '@shared-services/board-data/board-data.service';

@Component({
  selector: 'account-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    TemplateCardComponent,
    BoardsContainerComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  constructor(public boardData: BoardDataService){}
}
