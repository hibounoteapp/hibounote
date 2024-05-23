import { ElementRef, Injectable, Renderer2, inject } from '@angular/core';
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

  resizeMouseDown(event: MouseEvent) {
    this.boardService.draggable = false;
  }

  resizeMouseUp(event: MouseEvent) {
    this.boardService.draggable = true;
  }

  resizeElement(event: MouseEvent, renderer: Renderer2) {
    let mouseX = event.clientX
    let mouseY = event.clientY
    const abstractElement: HTMLElement = renderer.selectRootElement(this.boardService.activeResizeElement, true)
    const groupId = this.boardService.instance.getId(abstractElement.parentElement)
    if(groupId.toString() != 'jsplumb-1-1') {
      const element: Element | null = this.boardService.instance.getManagedElement(groupId)
      const groupidtop = element ? Number(getComputedStyle(element).top.replace(/([a-z])/g, '')): 0;
      const groupidleft = element ? Number(getComputedStyle(element).left.replace(/([a-z])/g, '')): 0;
      mouseX= mouseX - groupidleft
      mouseY= mouseY - groupidtop
    }

    let position = {
      top: Number(abstractElement.style.top.replace(/([a-z])/g, '')),
      left: Number(abstractElement.style.left.replace(/([a-z])/g, ''))
    }

    let calcSize = {
      width:((mouseX/this.boardService.zoomScale) - position.left + 10)-this.boardService.translation.x,
      height:((mouseY/this.boardService.zoomScale) - position.top + 10)-this.boardService.translation.y
    }

    renderer.setStyle(abstractElement,'width',`${calcSize.width}px`)
    renderer.setStyle(abstractElement,'height',`${calcSize.height}px`)
  }

  createNode(x: number, y: number, type: string, renderer: Renderer2): HTMLElement {
    let node = renderer.createElement('div')
    let dragDiv = renderer.createElement('div'); //? Div created to still drag the note when holding in text area
      renderer.addClass(dragDiv,'dragDiv')
      renderer.addClass(dragDiv,'nodeElement')
    let desc = renderer.createElement('textarea');
      desc.className = 'desc nodeElement';
      renderer.addClass(desc,'desc')
      renderer.addClass(desc,'nodeElement')
      renderer.setAttribute(desc,'readonly','')
      renderer.setAttribute(desc,'disabled','true')
    let resizeButton = renderer.createElement('div');
      renderer.addClass(resizeButton,'resizeButton')
      renderer.addClass(resizeButton,'nodeElement')
    let linkActionButton = renderer.createElement('div');
      renderer.addClass(linkActionButton, 'linkActionButton')
      renderer.addClass(linkActionButton, 'linkAction')
      renderer.addClass(linkActionButton, 'nodeElement')
    let fadeDiv = renderer.createElement('div');
      renderer.addClass(fadeDiv, 'fadeDiv')
      renderer.addClass(fadeDiv, 'nodeElement')

    renderer.addClass(node, 'nodeContainer')
    renderer.addClass(node, 'node')

    renderer.appendChild(node,dragDiv);
    renderer.appendChild(node,fadeDiv)
    renderer.appendChild(node,resizeButton);
    renderer.appendChild(node,linkActionButton);
    renderer.appendChild(node,desc);


    let top = (y/this.boardService.zoomScale)-this.boardService.translation.y
    let left = (x/this.boardService.zoomScale)-this.boardService.translation.x

    renderer.setStyle(node,'position','absolute')
    renderer.setStyle(node,'top',`${top}px`)
    renderer.setStyle(node,'left',`${left}px`)

    this.clearActiveNote(renderer)
    return node
  }

  setActiveNote(element: Element) {
    this.activeNode = element;
  }

  clearActiveNote(renderer: Renderer2) {
    if(this.activeNode) {
      let element: Element = renderer.selectRootElement(this.activeNode,true);
      if(this.activeNode.className.includes('nodeContainer')) {
        element = this.activeNode
      }
      if(this.activeNode.className.includes('nodeElement')) {
        if(this.activeNode.parentElement) element = this.activeNode.parentElement
      }

        element.className = element.className.replace(' activeNode','');
        let descDiv = element.querySelector('.desc')
        renderer.setAttribute(descDiv,'readonly','')
        renderer.setAttribute(descDiv,'disabled','true')
        let dragDiv = element.querySelector('.dragDiv')
        if(dragDiv) dragDiv.className = dragDiv.className.replace(' hidden','')
        this.activeNode = undefined;
    }
  }

}
