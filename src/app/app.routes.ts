import { Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { BoardComponent } from '../pages/board/board.component';
import { AccountComponent } from '../pages/account/account.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'board',
    component: BoardComponent
  },
  {
    path: 'account',
    component: AccountComponent
  },
];
