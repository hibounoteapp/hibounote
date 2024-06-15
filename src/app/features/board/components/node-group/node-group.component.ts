import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IconService } from '@shared-services/icon/icon.service';

@Component({
  selector: 'node-group-component',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './node-group.component.html',
  styleUrl: './node-group.component.scss'
})
export class NodeGroupComponent {
  @Input() innerTextarea: string | null = null;
  constructor(iconService:IconService){}
}
