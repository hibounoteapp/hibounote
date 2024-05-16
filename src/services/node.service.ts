import { Injectable, inject } from '@angular/core';
import { BoardService } from './board.service';

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
      this.board.activeResizeElement.style.width= `${mouseX - position.left + 10}px`
      this.board.activeResizeElement.style.height= `${mouseY - position.top + 10}px`
    }

  }

  createNode(x: number, y: number, type: string): HTMLElement {
    console.log('create')
    let div = document.createElement('div');
    let title = document.createElement('p');
      title.innerHTML = 'Title';
      title.className = 'title';
    let desc = document.createElement('p');
      desc.innerHTML = 'Desc';
      desc.className = 'desc';
    let resizeButton = document.createElement('div');
      resizeButton.className = 'resizeButton'
    let linkActionButton = document.createElement('div');
      linkActionButton.className = 'linkActionButton linkAction'
    div.className = 'nodeContainer node';
    div.appendChild(resizeButton);
    div.appendChild(linkActionButton);
    div.appendChild(title);
    div.appendChild(desc);
    if(type == 'note') {
      div.style.borderColor = '#baf593'
    }

    if(type == 'to-do') {
      div.style.borderColor = '#7eeddb'
    }

    if(type == 'title') {
      div.style.borderColor = '#ed897e'
    }
    div.style.position = 'absolute'
    div.style.top = `${y}px`;
    div.style.left = `${x}px`;

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
    // this.container.nativeElement.appendChild(div)
    // this.instance.manage(div)

  }

  constructor() { }
}
