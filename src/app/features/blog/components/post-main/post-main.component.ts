import { Component } from '@angular/core';
import { PostComponent } from '../post/post.component';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIcon } from '@angular/material/icon';
import { IconService } from '@shared-services/icon/icon.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Post } from '@custom-interfaces/post';
import { ContentService } from '../../services/content/content.service';
import { MarkdownModule, MarkdownPipe, MarkdownService } from 'ngx-markdown';

@Component({
  selector: 'blog-post-main',
  standalone: true,
  imports: [MatTabsModule, CommonModule, PostComponent, MatIcon, RouterModule, MarkdownPipe, MarkdownModule],
  templateUrl: './post-main.component.html',
  providers: [MarkdownService],
  styleUrl: './post-main.component.scss'
})
export class PostMainComponent {
  post!: Post | undefined;
  constructor(icon: IconService, activatedRoute: ActivatedRoute, content: ContentService, public markdown: MarkdownService) {
    activatedRoute.queryParamMap.subscribe((p)=>{
      const id = Number(p.get('id'))
      this.post = content.posts.find(e=>e.id === id);
    })
  }
}
