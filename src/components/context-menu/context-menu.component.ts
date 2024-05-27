import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { NodeService } from '../../services/node.service';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.scss'
})
export class ContextMenuComponent{
  @Input() show: boolean = false;
  @ViewChildren('cmButtons') buttons!: QueryList<ElementRef>;


  constructor(
    public nodeService: NodeService,
    private boardService: BoardService,
    private renderer: Renderer2
  ) {

  }

  newNode(type: string) {
    const x = this.boardService.contextMenu.x
    const y = this.boardService.contextMenu.y
    this.nodeService.createNode(x,y,type, this.renderer)
    this.boardService.contextMenu.show=false;
  }

  deleteNode() {
    if(!this.nodeService.activeNode)return

    this.nodeService.deleteNode(this.nodeService.activeNode,this.renderer);
    this.boardService.contextMenu.show=false;
  }
}
