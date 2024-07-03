import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { NodeComponent } from '../../components/node/node.component';
import { ContextMenuComponent } from '../../components/context-menu/context-menu.component';
import { ToolboxComponent } from '../../components/toolbox/toolbox.component';
import { ControlpanComponent } from '../../components/controlpan/controlpan.component';
import { NodeService } from '../../services/node/node.service';
import { BoardService } from '@shared-services/board/board.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { BoardDataService } from '@shared-services/board-data/board-data.service';
import { CookiesService } from '@core-services/cookies/cookies.service';

@Component({ selector: 'board',
    standalone: true,
    templateUrl: './board.component.html',
    styleUrl: './board.component.scss',
    imports: [
      RouterOutlet,
      CommonModule,
      MatIconModule,
      NodeComponent,
      ContextMenuComponent,
      ToolboxComponent,
      ControlpanComponent,
      NavbarComponent,
      RouterModule
    ],
    providers: [HttpClient]
  })

export class BoardComponent implements AfterViewInit, OnInit{

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
        this.nodeService.deleteNode(activeNode,this.renderer,this.nodeService)
      }
    }

  @HostListener('window:unload', ['$event'])
    unloadHandler(event: Event) {
        this.PostCall();
    }

  @HostListener('window:beforeunload', ['$event'])
    beforeUnloadHander(event: Event) {
        this.boardData.saveData().then(()=>{
          return true;
        }).catch(()=>{
          return false;
        })
    }

  PostCall() {
        console.log('PostCall');
    }


  editNode(attribute: string, value: string) {
    if(!this.nodeService.activeNode) return;
    this.nodeService.editNode(attribute,this.nodeService.activeNode,this.renderer,value);
  }

  disactivateNode() {
    this.nodeService.clearActiveNote(this.renderer)
  }

  initEvents() {
    this.renderer.listen(document, 'pointerup',this.boardService.pointerUp)


    this.renderer.listen(this.boardContainer.nativeElement,
      'pointerdown',
      (event: PointerEvent)=>{
        if(event.button != 2) this.boardService.contextMenu.show = false;
        this.boardService.contextMenu.show = false
        this.boardService.pointerDown(event,this.nodeService,this.renderer, this.boardContainer.nativeElement)
    })

    this.renderer.listen(this.boardContainer.nativeElement,
      'pointerup',
      (event: PointerEvent)=>{
        this.boardService.pointerUpBoard(event,this.nodeService, this.renderer);
    })

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

    this.renderer.listen(window,'keydown',(event:KeyboardEvent)=>{
      this.boardService.keydown(event);
      if(event.code === "Space") this.boardContainer.nativeElement .style.cursor = 'grab'
    })

    this.renderer.listen(window,'keyup',(event:KeyboardEvent)=>{
      this.boardService.keyup(event);
      if(event.code === "Space") this.boardContainer.nativeElement .style.cursor = ''
    })


    this.renderer.listen(this.boardContainer.nativeElement,'contextmenu',(event: MouseEvent)=>{
      event.preventDefault()
      this.boardService.contextMenu.show = true;

      this.boardService.contextMenu.x = event.clientX
      this.boardService.contextMenu.y = event.clientY
      if(!(event.target instanceof Element)) return;

    })


  }

  constructor(
    public renderer: Renderer2,
    private activeRoute: ActivatedRoute,
    public nodeService: NodeService,
    public boardService: BoardService,
    public boardData: BoardDataService,
    private cookiesService: CookiesService) {

      boardService.appRenderer = renderer
    }

  ngOnInit(): void {
    this.nodeService.clearActiveConnection();
    this.nodeService.clearActiveNote(this.renderer);
  }

  ngAfterViewInit(): void {
    this.boardService.init(this.container, this.nodeService, this.boardData, this.renderer);
    this.boardData.renderer = this.renderer;
    this.boardData.checkData(this.renderer);
    this.initEvents();
    this.boardService.disablePanzoom()
    this.boardService.enablePanzoom()

  }

}
