import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TemplateCardComponent } from './components/template-card/template-card.component';
import { BoardsCardComponent } from './components/boards-card/boards-card.component';

@Component({
  selector: 'account-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    TemplateCardComponent,
    BoardsCardComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
