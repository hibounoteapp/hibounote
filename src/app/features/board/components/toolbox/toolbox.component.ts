import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NodeService } from '../../services/node/node.service';
import { CommonModule } from '@angular/common';
import { BoardService } from '../../../../shared/services/board/board.service';

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

  deactivateConnection() {
    this.nodeService.clearActiveConnection();
  }

  editNode(attribute: string, value: string) {
    if(!this.nodeService.activeNode) return
    this.nodeService.editNode(attribute,this.nodeService.activeNode,this.renderer,value)
  }

  editConnection(value: string) {
    this.nodeService.editConnection(value)
  }

  toggleLabelConnection() {
    this.nodeService.toggleLabelConnection(this.renderer);
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
