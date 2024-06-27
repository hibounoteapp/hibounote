import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/pages/home/home.component';
import { BoardComponent } from './features/board/pages/board/board.component';
import { AccountComponent } from './features/account/pages/account/account.component';
import { LoginComponent } from './features/login/pages/login/login.component';
import { SignUpComponent } from './features/sign-up/pages/sign-up/sign-up.component';
import { ResetPasswordComponent } from './features/reset-password/pages/reset-password/reset-password.component';
import { AboutComponent } from './features/about/pages/about/about.component';
import { TutorialComponent } from './features/tutorial/pages/tutorial/tutorial.component';
import { TermsComponent } from './features/terms/pages/terms/terms.component';
import { SupportComponent } from './features/support/pages/support/support.component';
import { BlogComponent } from './features/blog/pages/blog/blog.component';
import { PostComponent } from './features/blog/pages/post/post.component';

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
  {
    path: 'blog',
    component: BlogComponent
  },
  {
    path: 'blog/post',
    component: PostComponent
  },
];
