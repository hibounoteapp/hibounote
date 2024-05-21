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
      desc.addEventListener('keydown',this.autosize)
      desc.style.cssText = 'min-height:30px; height: 30px;';
      desc.innerHTML = 'Desc';
      desc.className = 'desc nodeElement';
      desc.setAttribute('readonly','')
      desc.setAttribute('disabled','true')
    let resizeButton = document.createElement('div');
      resizeButton.className = 'resizeButton nodeElement'
    let linkActionButton = document.createElement('div');
      linkActionButton.className = 'linkActionButton linkAction nodeElement'
    div.className = 'nodeContainer node';

    div.appendChild(dragDiv);
    div.appendChild(resizeButton);
    div.appendChild(linkActionButton);
    div.appendChild(desc);
    if(type == 'note') {
      div.style.borderColor = '#035503'
    }

    if(type == 'to-do') {
      div.style.borderColor = '#030355'
    }

    if(type == 'title') {
      div.style.borderColor = '#550303'
    }
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

  autosize(event: Event){
    if(event.target instanceof HTMLTextAreaElement){
      let el = event.target;
      setTimeout(function(){
        el.style.cssText = 'min-height:30px; height: 30px;';
        // for box-sizing other than "content-box" use:
        // el.style.cssText = '-moz-box-sizing:content-box';
        el.style.cssText = 'height:' + (el.scrollHeight) + 'px';
      },0);
    }
  }

  constructor() { }
}
