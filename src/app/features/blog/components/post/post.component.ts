import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'blog-post',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent {
  @Input() id!: number;
  @Input() title!: string;
  @Input() shortDesc!: string;
  @Input() desc!: string;
  @Input() tag!: string;
  @Input() date!: Date;
  @Input() imageURL?: string;

}
