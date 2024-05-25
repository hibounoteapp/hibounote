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

@Component({ selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, CommonModule, MatIconModule, NodeComponent],
    providers: [HttpClient]
  })

export class AppComponent implements AfterViewInit{

  @ViewChild('main', {static: true}) container!: ElementRef<HTMLElement>;
  @ViewChild('toolbox', {static: true}) toolbox!: ElementRef<HTMLElement>;
  @ViewChild('board', {static: true}) boardContainer!: ElementRef<HTMLElement>;
  mouseX: number = 0;
  mouseY: number = 0;

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

  initEvents() {
    this.renderer.listen(document, 'pointerup',this.boardService.pointerUp)

    this.renderer.listen(this.boardContainer.nativeElement,
      'pointerdown',
      (event: PointerEvent)=>{
        this.boardService.pointerDown(event,this.nodeService,this.renderer)
    })

    this.renderer.listen(this.toolbox.nativeElement,
      'pointerdown',
      ()=>{
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

    this.renderer.listen(this.boardContainer.nativeElement,'contextmenu',(event: Event)=>{
      event.preventDefault()
    })
  }

  constructor(
    private renderer: Renderer2,
    private domSanitizer: DomSanitizer,
    private iconRegistry: MatIconRegistry,
    public nodeService: NodeService,
    public boardService: BoardService,
    private iconService: IconService) {
      iconService.registerIcons(iconRegistry,domSanitizer)

    }

  ngAfterViewInit(): void {
    this.boardService.init(this.container, this.nodeService, this.renderer)
    this.initEvents()
  }

}

