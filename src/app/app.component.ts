import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, Renderer2, ViewChild, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NodeService } from '../services/node.service';
import { BoardService } from '../services/board.service';
import { MatIconRegistry, MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { IconService } from '../services/icon.service';
import { NodeComponent } from '../components/node/node.component';
import { ContextMenuComponent } from '../components/context-menu/context-menu.component';

@Component({ selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, CommonModule, MatIconModule, NodeComponent, ContextMenuComponent],
    providers: [HttpClient]
  })

export class AppComponent implements AfterViewInit{

  @ViewChild('main', {static: true}) container!: ElementRef<HTMLElement>;
  @ViewChild('toolbox', {static: true}) toolbox!: ElementRef<HTMLElement>;
  @ViewChild('board', {static: true}) boardContainer!: ElementRef<HTMLElement>;

  @HostListener('window:mousemove',['$event'])
    onMouseMove(event: MouseEvent) {
      if(event.button != 0) return
      if(!this.boardService.draggable) this.nodeService.resizeElement(event, this.renderer)
    }

  @HostListener('dragstart',['$event'])
    onDragStart(event: DragEvent) {
      if(event.target instanceof Element && event.dataTransfer) {
        event.dataTransfer.setData('text',event.target.id);
        event.dataTransfer.effectAllowed = 'move';
      }
    }

  @HostListener('window:mouseup',['$event'])
    onMouseUp(event: MouseEvent) {
      if(!this.boardService.draggable) this.boardService.draggable=true;
    }

  @HostListener('window:mousedown',['$event'])
    onMouseDown(event: MouseEvent) {
      if(!(event.target instanceof Element)) return
      if(event.button != 2 && !event.target.classList.contains('contextMenu')) this.boardService.contextMenu.show = false;

    }

  @HostListener('window:keydown',['$event'])
    onKeyDown(event: KeyboardEvent) {
      if(event.key === 'Delete' && this.nodeService.activeNode) {
        const activeNode = this.nodeService.activeNode
        this.nodeService.deleteNode(activeNode,this.renderer)
      }
    }

  initEvents() {
    this.renderer.listen(document, 'pointerup',this.boardService.pointerUp)

    this.renderer.listen(this.boardContainer.nativeElement,
      'pointerdown',
      (event: PointerEvent)=>{
        if(event.button != 2) this.boardService.contextMenu.show = false;
        this.boardService.contextMenu.show = false
        this.boardService.pointerDown(event,this.nodeService,this.renderer)
    })

    this.renderer.listen(this.toolbox.nativeElement,
      'pointerdown',
      ()=>{
      this.boardService.contextMenu.show = false;

      this.boardService.disablePanzoom()
    });

    this.renderer.listen(this.boardContainer.nativeElement,'wheel', this.boardService.zoom);

    this.renderer.listen(this.boardContainer.nativeElement,
      'dragover',
      (event: DragEvent)=>{
      this.boardService.droppable = true;
      this.boardService.dragOverBoard(event)
    });

    this.renderer.listen(this.boardContainer.nativeElement,
      'drop',
      (event: DragEvent)=>{
        this.boardService.dropNode(event,this.nodeService,this.container, this.renderer)
    });

    this.renderer.listen(this.boardContainer.nativeElement,'contextmenu',(event: MouseEvent)=>{
      event.preventDefault()
      this.boardService.contextMenu.show = true;

      this.boardService.contextMenu.x = event.clientX
      this.boardService.contextMenu.y = event.clientY

    })
  }

  constructor(
    public renderer: Renderer2,
    private domSanitizer: DomSanitizer,
    private iconRegistry: MatIconRegistry,
    public nodeService: NodeService,
    public boardService: BoardService,
    private iconService: IconService) {
      iconService.registerIcons(iconRegistry,domSanitizer)
    boardService.appRenderer = renderer
    }

  ngAfterViewInit(): void {
    this.boardService.init(this.container, this.nodeService, this.renderer)
    this.initEvents()
    this.boardService.disablePanzoom()
    this.boardService.enablePanzoom()
  }

}

