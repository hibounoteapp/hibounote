import { Component } from '@angular/core';
import { FooterComponent } from '@shared-components/footer';
import { NavbarComponent } from '@shared-components/navbar';
import { MainComponent } from '../../components/main/main.component';
import { PostMainComponent } from '../../components/post-main/post-main.component';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from '../../services/content/content.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [FooterComponent, NavbarComponent, PostMainComponent],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  constructor(){}
}
