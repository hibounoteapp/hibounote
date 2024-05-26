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
export class ContextMenuComponent implements AfterViewInit{
  @Input() show: boolean = false;
  @ViewChildren('cmButtons') buttons!: QueryList<ElementRef>;

  constructor(
    private nodeService: NodeService,
    private boardService: BoardService,
    private renderer: Renderer2
  ) {

  }

  ngAfterViewInit(): void {
    this.buttons.forEach((e: ElementRef)=>{
      const abstractElement = this.renderer.selectRootElement(e.nativeElement,true)
      this.renderer.listen(abstractElement,'mouseup',()=>{
        console.log('node')
        const x = this.boardService.contextMenu.x
        const y = this.boardService.contextMenu.y
        this.nodeService.createNode(x,y,e.nativeElement.id, this.renderer)
        this.boardService.contextMenu.show=false;
      })
    })
  }
}
