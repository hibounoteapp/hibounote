import { ElementRef, Injectable, inject } from '@angular/core';
import { BoardService } from './board.service';
import { transition } from '@angular/animations';
@Injectable({
  providedIn: 'root'
})
export class NodeService {
  nodes!: ArrayLike<any>
  activeResizeElement: HTMLElement | undefined;
  activeNode: Element | undefined;


  constructor(
    private boardService: BoardService,
  ) {}

  setNodes(newNodes: ArrayLike<any>) {
    this.nodes = newNodes;
  }

  getNodes(): ArrayLike<any> {
    return this.nodes
  }

  resizeMouseDown($event: MouseEvent) {
    this.boardService.draggable = false;
  }

  resizeMouseUp($event: MouseEvent) {
    this.boardService.draggable = true;
  }

  resizeElement($event: MouseEvent) {
    let mouseX = $event.clientX
    let mouseY = $event.clientY
    const groupId = this.boardService.instance.getId(this.boardService.activeResizeElement?.parentElement)
    if(groupId.toString() != 'jsplumb-1-1') {
      const element: Element | null = this.boardService.instance.getManagedElement(groupId)
      const groupidtop = element ? Number(getComputedStyle(element).top.replace(/([a-z])/g, '')): 0;
      const groupidleft = element ? Number(getComputedStyle(element).left.replace(/([a-z])/g, '')): 0;
      mouseX= mouseX - groupidleft
      mouseY= mouseY - groupidtop
    }

    if(this.boardService.activeResizeElement?.style) {

      let position = {
        top: Number(this.boardService.activeResizeElement.style.top.replace(/([a-z])/g, '')),
        left: Number(this.boardService.activeResizeElement.style.left.replace(/([a-z])/g, ''))
      }
      this.boardService.activeResizeElement.style.width= `${((mouseX/this.boardService.zoomScale) - position.left + 10)-this.boardService.translation.x}px`
      this.boardService.activeResizeElement.style.height= `${((mouseY/this.boardService.zoomScale) - position.top + 10)-this.boardService.translation.y}px`
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
    div.style.top = `${(y/this.boardService.zoomScale)-this.boardService.translation.y}px`;

    div.style.left = `${(x/this.boardService.zoomScale)-this.boardService.translation.x}px`;

    for (const element of [this.nodes]) {
      this.boardService.getInstance().addSourceSelector('.linkAction',{
        anchor: 'Continuous',
        endpoint: "Dot",
      })
      this.boardService.getInstance().addTargetSelector('.node',{
        anchor: 'Continuous',
        endpoint: "Dot",
      })
    }

    return div
  }

  clearActiveNote() {
    if(this.activeNode) {
      let element: Element = this.activeNode;
      if(this.activeNode.className.includes('nodeContainer')) {
        element = this.activeNode
      }
      if(this.activeNode.className.includes('nodeElement')) {
        if(this.activeNode.parentElement) element = this.activeNode.parentElement
      }

        element.className = element.className.replace(' activeNode','');
        let descDiv = element.querySelector('.desc')
        descDiv?.setAttribute('readonly', '')
        descDiv?.setAttribute('disabled', 'true')
        let dragDiv = element.querySelector('.dragDiv')
        if(dragDiv) dragDiv.className = dragDiv.className.replace(' hidden','')
        this.activeNode = undefined;

    }
  }

}
