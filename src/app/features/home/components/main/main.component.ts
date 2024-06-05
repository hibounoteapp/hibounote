import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SimpleButtonComponent } from '@shared-components/simple-button';

@Component({
  selector: 'home-main',
  standalone: true,
  imports: [RouterModule, SimpleButtonComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
