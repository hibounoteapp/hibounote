import { AfterViewInit, Directive, HostListener, inject } from '@angular/core';
import { NodeService } from '../services/node.service';

@Directive({
  selector: '[appMouse]',
  standalone: true,

})
export class MouseDirective implements AfterViewInit{
  nodes: NodeService = inject(NodeService)

  // @HostListener('window:mousemove',['$event'])
  // onMouseMove(event: MouseEvent) {
  //   console.log('Mouse moving: '+ this.nodes.draggable)

  //   if(!this.nodes.draggable) {
  //     console.log('resize element')
  //     this.nodes.resizeElement(event)
  //   }
  // }

  // @HostListener('dragstart',['$event'])
  // onDragStart(event: DragEvent) {
  //   if(event.target instanceof Element && event.dataTransfer) {
  //     event.dataTransfer.setData('text',event.target.id);
  //     event.dataTransfer.effectAllowed = 'move';
  //   }
  // }


  constructor() { }

  ngAfterViewInit(): void {
    console.log(this.nodes.draggable)
  }

}
