import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'node-component',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './node.component.html',
  styleUrl: './node.component.scss'
})
export class NodeComponent{
  @Input() innerTextarea: string| null = null;

  log(msg: string) {
    console.log(msg)
  }
}