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
import { SavedNode } from '@custom-interfaces/saved-node';
import { Board } from '@custom-interfaces/board';
import { SavedConnection } from '@custom-interfaces/saved-connection';

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
    const activeBoard: Board | undefined = boardData.getData(id)

    if(activeBoard) {
      const scale = activeBoard.zoomScale;
      this.boardService.zoomScale = scale
      this.boardService.panzoom.zoom(scale);
      this.boardService.instance.setZoom(scale);
      this.boardService.translation = this.boardService.panzoom.getPan()

      if(activeBoard.elements) {
        activeBoard.elements.forEach((e:SavedNode)=>{
          const x = e.x * activeBoard.zoomScale;
          const y = e.y * activeBoard.zoomScale;
          const width = e.width;
          const height = e.height;
          const color = e.color;
          const innerText = e.innerText ?? '';
          const type = e.type;
          const nodeId = e.id;

          nodeService.loadNode(x,y,width,height,color,innerText,type,renderer,nodeId)
        })
      }

      if(activeBoard.connetions) {
        activeBoard.connetions.forEach((c: SavedConnection)=>{
          let source;
          try { //? Check if source element is a group, since the group Id and Element Id are different
            source = this.boardService.instance.getGroup(c.sourceId).el;
          } catch (error) {
            source = this.boardService.instance.getManagedElement(c.sourceId);
          }

          let target
          try {//?
            target = this.boardService.instance.getGroup(c.targetId).el;
          } catch (error) {
            target = this.boardService.instance.getManagedElement(c.targetId);
          }

          const anchor = c.anchor;
          const connector = c.connector;
          const paintStyle = c.paintStyle;
          const hoverPaintStyle = c.hoverPaintStyle
          const endpointStyle = c.endpointStyle
          let overlays:OverlaySpec[]=[];
          c.overlays.forEach((overlay)=>{
            	let overlayConfig:OverlaySpec;
              if(overlay.label.inputValue != '') {
                overlayConfig = {
                  type: 'Custom',
                  options: {
                    create: ()=>{
                      const label: HTMLInputElement = renderer.createElement('input');
                      label.value = overlay.label.inputValue;
                      renderer.setAttribute(label, 'class', 'labelConnection');
                      renderer.setAttribute(label,'type','text');
                      return label;
                    },
                    location: 0.5,
                  }
                }
                overlays.push(overlayConfig);
              }
          })

          this.boardService.instance.connect({
            anchor,
            connector,
            source,
            target,
            paintStyle,
            hoverPaintStyle,
            endpointStyle,
            overlays,
          })
        })
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

