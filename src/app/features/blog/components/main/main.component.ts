import { Component, ViewEncapsulation } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs'
import { ContentService } from '../../services/content/content.service';
import { CommonModule } from '@angular/common';
import { PostComponent } from '../post/post.component';
import { Post } from '@custom-interfaces/post';

@Component({
  selector: 'blog-main',
  standalone: true,
  imports: [MatTabsModule, CommonModule, PostComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class MainComponent {

  releaseNotesPosts!: Post[];
  FAQPosts!: Post[];
  userGuidePosts!: Post[];
  communityPosts!: Post[];

  constructor(public content: ContentService) {
    this.releaseNotesPosts =
    content.posts.filter(e=>{
      return e.tag === "Release Notes"
    })

    this.FAQPosts =
    content.posts.filter(e=>{
      return e.tag === "FAQ"
    })

    this.userGuidePosts =
    content.posts.filter(e=>{
      return e.tag === "User Guide"
    })

    this.communityPosts =
    content.posts.filter(e=>{
      return e.tag === "Community"
    })
  }

}
