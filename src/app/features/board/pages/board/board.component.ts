import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
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
import { Connection, Overlay, OverlaySpec } from '@jsplumb/browser-ui';

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
      NavbarComponent
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


  editNode(attribute: string, value: string) {
    if(!this.nodeService.activeNode) return;
    this.nodeService.editNode(attribute,this.nodeService.activeNode,this.renderer,value);
  }

  disactivateNode() {
    this.nodeService.clearActiveNote(this.renderer)
  }

  checkData(boardData: BoardDataService, nodeService: NodeService, renderer: Renderer2) {
    const id = this.activeRoute.snapshot.queryParamMap.get('id') ?? ''
    const activeBoard = boardData.getData(id)

    if(activeBoard) {
      const scale = activeBoard.zoomScale;
      this.boardService.zoomScale = scale
      this.boardService.panzoom.zoom(scale);
      this.boardService.instance.setZoom(scale);
      this.boardService.translation = this.boardService.panzoom.getPan()

      if(activeBoard.elements) {
        activeBoard.elements.forEach((e: {
          element: HTMLElement,
          id: string | null
        }) => {
          const x = Number(e.element.style.left.replace(/[a-z]/g,'')) * activeBoard.zoomScale;
          const y = Number(e.element.style.top.replace(/[a-z]/g,'')) * activeBoard.zoomScale;
          const width = Number(e.element.style.width.replace(/[a-z]/g,''));
          const height = Number(e.element.style.height.replace(/[a-z]/g,''));
          const color = e.element.style.backgroundColor;
          const innerText = e.element.querySelector('textarea')?.value ?? null;
          const type = e.element.classList.contains('nodeGroup') ? 'group' : 'node'
          const nodeId = e.id;

          nodeService.loadNode(x,y,width,height,color,innerText,type,renderer,nodeId)
        })
      }

      if(activeBoard.connetions) {

        if(activeBoard.connetions instanceof Array) {
          activeBoard.connetions.forEach((e: Connection)=>{

            let source;
            try { //? Check if source element is a group, since the group Id and Element Id are different
              source = this.boardService.instance.getGroup(e.sourceId).el;
            } catch (error) {
              source = this.boardService.instance.getManagedElement(e.sourceId);
            }

            let target
            try {//?
              target = this.boardService.instance.getGroup(e.targetId).el;
            } catch (error) {
              target = this.boardService.instance.getManagedElement(e.targetId);
            }

            const paintStyle = e.paintStyle;
            const hoverPaintStyle = e.hoverPaintStyle
            const endpointStyle = e.endpointStyle

            type CustomOverlay2 <T> = Partial<T> & {
              canvas?: HTMLInputElement
            };//? For some reason, JsPlumb 'CustomOverlay' base type don't have the reference for 'canvas', which is necessary to get internal information about the overlay
            let overlays = e.overlays;
            let overlaysToAdd:OverlaySpec[]=[];
            for (const key in overlays) {
              const element: CustomOverlay2<Overlay> = overlays[key];
              const inputValue = element.canvas?.value;
              let overlayConfig: OverlaySpec;
              if(inputValue) {
                overlayConfig = {
                  type: 'Custom',
                  options: {
                    create: ()=>{
                      const label: HTMLInputElement = renderer.createElement('input');
                      label.value = inputValue;
                      renderer.setAttribute(label, 'class', 'labelConnection');
                      renderer.setAttribute(label,'type','text');
                      return label;
                    },
                    location: 0.5,
                  }
                }
                overlaysToAdd.push(overlayConfig);
              }
            }

            this.boardService.instance.connect({
              anchor: 'Continuous',
              connector: 'Bezier',
              source,
              target,
              paintStyle,
              hoverPaintStyle,
              endpointStyle,
              overlays: overlaysToAdd,
            })
          })
        }
      }

      if(activeBoard.groups) {

        activeBoard.groups.forEach(e=>{
          const group = this.boardService.instance.getGroup(e.groupId??'');
          const children = e.children.map((child)=>{
            return this.boardService.instance.getManagedElement(child.id??'')
          })

          children.forEach((c:HTMLElement)=>{
            if(group.el instanceof HTMLElement) {
              const top = Number(c.style.top.replace(/[a-z]/g,'')) + Number(group.el.style.top.replace(/[a-z]/g,''));
              const left = Number(c.style.left.replace(/[a-z]/g,'')) + Number(group.el.style.left.replace(/[a-z]/g,''));
              renderer.setStyle(c, 'top',`${top}px`)
              renderer.setStyle(c, 'left',`${left}px`)
            }
            this.boardService.instance.addToGroup(group,c);
          })
        })

      }
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
    public boardData: BoardDataService,) {
      boardService.appRenderer = renderer
    }

  ngOnInit(): void {
    this.nodeService.clearActiveConnection();
    this.nodeService.clearActiveNote(this.renderer);
  }

  ngAfterViewInit(): void {
    this.boardService.init(this.container, this.nodeService, this.boardData, this.renderer);
    this.checkData(this.boardData,this.nodeService,this.renderer);
    this.initEvents();
    this.boardService.disablePanzoom()
    this.boardService.enablePanzoom()
    
  }

}

