import { Injectable, inject } from '@angular/core';
import { BoardService } from './board.service';
import { transition } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class NodeService {
  nodes!: ArrayLike<any>
  draggable: boolean = true;
  board: BoardService = inject(BoardService);

  setNodes(newNodes: ArrayLike<any>) {
    this.nodes = newNodes;
  }

  getNodes(): ArrayLike<any> {
    return this.nodes
  }

  resizeMouseDown($event: MouseEvent) {
    this.draggable = false;
    console.log(this.draggable)
  }

  resizeMouseUp($event: MouseEvent) {
    this.draggable = true;
    console.log(this.draggable)
  }

  resizeElement($event: MouseEvent) {
    let mouseX = $event.clientX
    let mouseY = $event.clientY
    const groupId = this.board.instance.getId(this.board.activeResizeElement?.parentElement)
    if(groupId.toString() != 'jsplumb-1-1') {
      const element: Element | null = this.board.instance.getManagedElement(groupId)
      const groupidtop = element ? Number(getComputedStyle(element).top.replace(/([a-z])/g, '')): 0;
      const groupidleft = element ? Number(getComputedStyle(element).left.replace(/([a-z])/g, '')): 0;
      mouseX= mouseX - groupidleft
      mouseY= mouseY - groupidtop
    }

    if(this.board.activeResizeElement?.style) {

      let position = {
        top: Number(this.board.activeResizeElement.style.top.replace(/([a-z])/g, '')),
        left: Number(this.board.activeResizeElement.style.left.replace(/([a-z])/g, ''))
      }
      this.board.activeResizeElement.style.width= `${((mouseX/this.board.zoomScale) - position.left + 10)-this.board.translation.x}px`
      this.board.activeResizeElement.style.height= `${((mouseY/this.board.zoomScale) - position.top + 10)-this.board.translation.y}px`
    }

  }

  createNode(x: number, y: number, type: string): HTMLElement {
    console.log('create')
    let div = document.createElement('div');
    let dragDiv = document.createElement('div'); //? Div created to still drag the note when holding in text area
      dragDiv.className = 'dragDiv nodeElement'
    let desc = document.createElement('textarea');
      desc.className = 'desc nodeElement';
      desc.setAttribute('readonly','')
      desc.setAttribute('disabled','true')
    let resizeButton = document.createElement('div');
      resizeButton.className = 'resizeButton nodeElement'
    let linkActionButton = document.createElement('div');
      linkActionButton.className = 'linkActionButton linkAction nodeElement'
    let fadeDiv = document.createElement('div');
      fadeDiv.className = 'fadeDiv nodeElement';

    div.className = 'nodeContainer node';

    div.appendChild(dragDiv);
    div.appendChild(fadeDiv)
    div.appendChild(resizeButton);
    div.appendChild(linkActionButton);
    div.appendChild(desc);

    div.style.position = 'absolute'
    div.style.top = `${(y/this.board.zoomScale)-this.board.translation.y}px`;

    div.style.left = `${(x/this.board.zoomScale)-this.board.translation.x}px`;

    for (const element of [this.nodes]) {
      this.board.getInstance().addSourceSelector('.linkAction',{
        anchor: 'Continuous',
        endpoint: "Dot",
      })
      this.board.getInstance().addTargetSelector('.node',{
        anchor: 'Continuous',
        endpoint: "Dot",
      })
    }

    return div
  }

  constructor() { }
}
