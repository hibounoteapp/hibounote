import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NodeService } from '../../services/node.service';
import { CommonModule } from '@angular/common';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'toolbox-component',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './toolbox.component.html',
  styleUrl: './toolbox.component.scss'
})
export class ToolboxComponent implements AfterViewInit {

  @ViewChild('toolbox',{static: true}) toolboxContainer!: ElementRef;

  constructor(
    public nodeService: NodeService,
    private boardService: BoardService,
    private renderer: Renderer2,
  ) {

  }

  deactivateNode() {
    this.nodeService.clearActiveNote(this.renderer)
  }

  editNode(attribute: string, value: string) {
    if(!this.nodeService.activeNode) return
    this.nodeService.editNode(attribute,this.nodeService.activeNode,this.renderer,value)
  }

  ngAfterViewInit(): void {

    this.renderer.listen(this.toolboxContainer.nativeElement,
      'pointerdown',
      ()=>{
      this.boardService.contextMenu.show = false;

      this.boardService.disablePanzoom()
    });
  }
}
