import { Component, Input, Renderer2 } from '@angular/core';
import { NodeService } from '../../services/node.service';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.scss'
})
export class ContextMenuComponent {
  @Input() show: boolean = false;

  newNode(type: string) {
    const x = this.boardService.contextMenu.x
    const y = this.boardService.contextMenu.y
    const container = this.renderer.selectRootElement('#main',true)
    const node = this.nodeService.createNode(x,y,'note', this.renderer)
    this.renderer.appendChild(container, node)

    this.boardService.instance.manage(node)
    this.boardService.enablePanzoom()
    this.boardService.contextMenu.show=false;
  }

  constructor(
    private nodeService: NodeService,
    private boardService: BoardService,
    private renderer: Renderer2
  ) {

  }
}
