import { Component } from '@angular/core';
import { FooterComponent } from '@shared-components/footer';
import { NavbarComponent } from '@shared-components/navbar';
import { MainComponent } from '../../components/main/main.component';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [FooterComponent, NavbarComponent, MainComponent],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent {

}
