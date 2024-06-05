import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'node-group-component',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './node-group.component.html',
  styleUrl: './node-group.component.scss'
})
export class NodeGroupComponent {
  @Input() innerTextarea: string | null = null;
}
