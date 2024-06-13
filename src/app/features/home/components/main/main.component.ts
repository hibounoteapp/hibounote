import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SimpleButtonComponent } from '@shared-components/simple-button';
import { CookiesPopupComponent } from '../cookies-popup/cookies-popup.component';
import { HomeComponent } from '../../pages/home/home.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'home-main',
  standalone: true,
  imports: [RouterModule, SimpleButtonComponent, CookiesPopupComponent, CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  constructor(public homeComponent: HomeComponent){

  }
}
