import { Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { BoardComponent } from '../pages/board/board.component';
import { AccountComponent } from '../pages/account/account.component';
import { LoginComponent } from '../pages/login/login.component';
import { SignUpComponent } from '../pages/sign-up/sign-up.component';
import { ResetPasswordComponent } from '../pages/reset-password/reset-password.component';
import { AboutComponent } from '../pages/about/about.component';
import { TutorialComponent } from '../pages/tutorial/tutorial.component';
import { TermsComponent } from '../pages/terms/terms.component';
import { SupportComponent } from '../pages/support/support.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignUpComponent
  },
  {
    path: 'resetpassword',
    component: ResetPasswordComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'tutorial',
    component: TutorialComponent
  },
  {
    path: 'board',
    component: BoardComponent
  },
  {
    path: 'account',
    component: AccountComponent
  },
  {
    path: 'terms',
    component: TermsComponent
  },

  {
    path: 'support',
    component: SupportComponent
  },
];
