import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IconService } from '@shared-services/icon/icon.service';

@Component({
  selector: 'node-component',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './node.component.html',
  styleUrl: './node.component.scss'
})
export class NodeComponent{
  @Input() innerTextarea: string| null = null;

  constructor(iconService: IconService){}
}
