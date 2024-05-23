import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, Renderer2, ViewChild, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as jsplumb from '@jsplumb/browser-ui';
import { NodeService } from '../services/node.service';
import { BoardService } from '../services/board.service';
import Panzoom from '@panzoom/panzoom';
import { MatIconRegistry, MatIconModule } from '@angular/material/icon';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { IconService } from '../services/icon.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, MatIconModule, HttpClientModule],
  providers: [HttpClient],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
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
      if(!this.boardService.draggable) this.nodeService.resizeElement(event)
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
    document.addEventListener('pointerup', this.boardService.pointerUp)
    this.boardContainer.nativeElement.addEventListener(
      'pointerdown',
      (event: PointerEvent)=>{
        this.boardService.pointerDown(event,this.nodeService)
    });

    this.toolbox.nativeElement.addEventListener(
      'pointerdown',
      ()=>{
      this.boardService.disablePanzoom()
    });

    this.boardContainer.nativeElement.addEventListener('wheel', this.boardService.zoom)

    this.boardContainer.nativeElement.addEventListener(
      'dragover',
      (event: DragEvent)=>{
      this.boardService.droppable = true;
      this.boardService.dragOverBoard(event)
    });

    this.boardContainer.nativeElement.addEventListener(
      'drop',
      (event: DragEvent)=>{
        this.boardService.dropNode(event,this.nodeService,this.container)
    });
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
    this.boardService.init(this.container, this.nodeService)
    this.initEvents()
  }

}

