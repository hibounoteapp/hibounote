import { Component, Input } from '@angular/core';

@Component({
  selector: 'tutorial-feature-card',
  standalone: true,
  imports: [],
  templateUrl: './feature-card.component.html',
  styleUrl: './feature-card.component.scss'
})
export class FeatureCardComponent {
  @Input() title!: string;
  @Input() description!: string;
  @Input() imageDemonstrationURL!: string;
}
