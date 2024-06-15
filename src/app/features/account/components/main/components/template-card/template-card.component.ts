import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { BoardDataService } from '@shared-services/board-data/board-data.service';

@Component({
  selector: 'account-main-templateCard',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule, ],
  templateUrl: './template-card.component.html',
  styleUrl: './template-card.component.scss'
})
export class TemplateCardComponent {

  constructor(protected boardData: BoardDataService){

  }

}
