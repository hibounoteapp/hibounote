import { CommonModule } from '@angular/common';
import { AfterViewInit, ApplicationConfig, Component, ElementRef, Host, HostListener, NgModule, OnInit, Renderer2, ViewChild, ViewChildren, importProvidersFrom, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as jsplumb from '@jsplumb/browser-ui';
import { NodeService } from '../services/node.service';
import { BoardService } from '../services/board.service';
import Panzoom from '@panzoom/panzoom';
import { MatIconModule } from '@angular/material/icon'
import { MatIconRegistry } from '@angular/material/icon';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

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

  iconRegistry: MatIconRegistry = inject(MatIconRegistry);
  nodes: NodeService = inject(NodeService);
  mouseX: number = 0;
  mouseY: number = 0;
  board: BoardService = inject(BoardService);
  zoom: number= 1;
    activeResizeElement: HTMLElement | undefined;
  droppable: boolean = false;
  draggable: boolean = true;
  activeNode: Element | undefined;

  @HostListener('window:mousemove',['$event'])
    onMouseMove(event: MouseEvent) {
      this.mouseX = event.clientX
      this.mouseY = event.clientY
      if(!this.draggable) {
        console.log('resize element')
        this.nodes.resizeElement(event)
      }
    }

  @HostListener('dragstart',['$event'])
    onDragStart(event: DragEvent) {
      if(event.target instanceof Element && event.dataTransfer) {
        event.dataTransfer.setData('text',event.target.id);
        event.dataTransfer.effectAllowed = 'move';
      }
    }
  @HostListener('window:mouseup',['$event'])
    onMouseUp(event: DragEvent) {
      this.draggable = true;
    }
  @HostListener('window:mousewheel',['$event'])
    onScrollMouse(event: WheelEvent) {
    }

  // @HostListener('window:mousemove',['$event'])
  //   onMouseMove(event: MouseEvent) {
  //     console.log('Mouse moving')
  //     if(!this.nodes.draggable) {
  //       console.log('resize element')
  //       this.resizeElement(event)
  //     }
  //   }

  // @HostListener('dragstart',['$event'])
  //   onDragStart(event: DragEvent) {
  //     if(event.target instanceof Element && event.dataTransfer) {
  //       event.dataTransfer.setData('text',event.target.id);
  //       event.dataTransfer.effectAllowed = 'move';
  //     }
  //     console.log(event)
  //   }

  constructor(
    private renderer: Renderer2,
    private domSanitizer: DomSanitizer) {
      //! Refactor
        this.iconRegistry.addSvgIcon('resize',this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/resize-outline.svg'))

        this.iconRegistry.addSvgIcon('pin',this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/pin-outline.svg'))

        this.iconRegistry.addSvgIcon('reader',this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/reader-outline.svg'))

        this.iconRegistry.addSvgIcon('zoom-in',this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/zoom-in.svg'))

        this.iconRegistry.addSvgIcon('zoom-out',this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/zoom-out.svg'))

        this.iconRegistry.addSvgIcon('maximize',this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/maximize.svg'))
  }

  dragOverBoard($event: DragEvent) {
    this.droppable = true
    $event.preventDefault();
    if($event.dataTransfer?.dropEffect) {
      $event.dataTransfer.dropEffect = 'move';
    }
  }

  zoomClick(event: Event, type: 'in' | 'out') {
    if(type === 'in') this.board.panzoom.zoomIn()
    if(type === 'out') this.board.panzoom.zoomOut()
    const scale = this.board.panzoom.getScale()
    this.board.zoomScale = scale
    this.board.getInstance().setZoom(scale)
    this.board.translation = this.board.panzoom.getPan()
  }

  toggleActiveNote() {
    if(this.activeNode) {
      let element: Element = this.activeNode;
      if(this.activeNode.className.includes('nodeContainer')) {
        element = this.activeNode
      }
      if(this.activeNode.className.includes('nodeElement')) {
        if(this.activeNode.parentElement) element = this.activeNode.parentElement
      }

        element.className = element.className.replace(' activeNode','');
        let descDiv = element.querySelector('.desc')
        descDiv?.setAttribute('readonly', '')
        descDiv?.setAttribute('disabled', 'true')
        let dragDiv = element.querySelector('.dragDiv')
        if(dragDiv) dragDiv.className = dragDiv.className.replace(' hidden','')
        this.activeNode = undefined;

    }
  }

  resetPan(event: Event) {
    this.board.panzoom.pan(0,0,{
      animate: true,
    })
    this.board.panzoom.zoom(1,{
      animate: true
    })
    const scale = this.board.panzoom.getScale()
    this.board.zoomScale = scale
    this.board.getInstance().setZoom(scale)
    this.board.translation = this.board.panzoom.getPan()
  }

  ngAfterViewInit(): void {
    this.board.panzoom = Panzoom(this.container.nativeElement, {
      canvas: true,
      cursor: '',
      minScale: 0.4,
      maxScale: 1.5

    })
    this.board.translation = this.board.panzoom.getPan()


    this.draggable = this.nodes.draggable
    const dragDrop = ($event: DragEvent) => { //? The drop event needs to be in 'AfterViewInit' because it access the node service, which is initialized only in this function (AfterViewInit)
      if($event.dataTransfer?.dropEffect) {
        $event.dataTransfer.dropEffect = 'move';
        if($event.target instanceof Element) {
          const div = this.nodes.createNode($event.x, $event.y, $event.dataTransfer.getData('text'))
          this.container.nativeElement.appendChild(div)
          this.board.getInstance().manage(div)
          enablePanzoom()
        }
      }
    }
    const disablePanzoom = () => {
      this.board.panzoom.destroy()
    }

    const pointerUp = (event: Event) => {
      enablePanzoom()
      this.board.translation = this.board.panzoom.getPan()
      console.log(this.board.translation)
    }

    const enablePanzoom = () => {
      this.board.panzoom.bind()
      this.board.panzoom.setOptions({
        cursor: '',

      })
    }

    const pointerDownNode = (event: PointerEvent) => { //? Handling click event in node
      if(!(event.target instanceof Element)) return

      const targetClass = event.target.className
      disablePanzoom()
      this.board.panzoom.setOptions({
        cursor:'',
      })

      let element: Element | undefined;
      if(event.target.parentElement?.className.includes('nodeContainer')) {
        element = event.target.parentElement;
      }
      if(targetClass.includes('nodeContainer')) {
        element = event.target;
      }

      if(element) {
        if(element != this.activeNode) this.toggleActiveNote()
        element.className += element.className.includes('activeNode') ? '':' activeNode'
        this.activeNode = element;
      }
    }

    const pointerDownConnection = (event: PointerEvent) => { //? Handling click event in connection
      if(!(event.target instanceof Element)) return

      console.log("Achou")
      disablePanzoom()
    }

    const pointerDown = (event: PointerEvent) => {
      console.log(event.target)
      if(document.activeElement && document.activeElement instanceof HTMLElement) document.activeElement.blur()

      if(!(event.target instanceof Element)) return

      if(event.target.tagName=='circle'){
        pointerDownConnection(event)
        return
      }


      if(event.target.className.includes('nodeContainer') || event.target.className.includes('nodeElement') || event.target.className.includes('connection')) {
        console.log('Node')
        pointerDownNode(event);
        return
      }

      this.toggleActiveNote();
    }

    const zoom = (event: WheelEvent) => {
      if(!event.shiftKey) return

      this.board.panzoom.zoomWithWheel(event)
      const scale = this.board.panzoom.getScale()
      this.board.zoomScale = scale
      this.board.getInstance().setZoom(scale)
      this.board.translation = this.board.panzoom.getPan()

      this.board.getInstance().repaintEverything()
      console.log(scale)
    }

    //! Refactor
    document.addEventListener('pointerup', pointerUp)
    this.toolbox.nativeElement.addEventListener('pointerdown',disablePanzoom)
    this.boardContainer.nativeElement.addEventListener('pointerdown', pointerDown)
    this.boardContainer.nativeElement.addEventListener('wheel', zoom)
    this.boardContainer.nativeElement.addEventListener('dragover',this.dragOverBoard,false);
    this.boardContainer.nativeElement.addEventListener('drop',dragDrop,false);

    const jsInstance = jsplumb.newInstance({
      container: this.container.nativeElement,
      elementsDraggable: true,

    });
    this.board.setInstance(jsInstance);



    this.nodes.setNodes(this.board.getInstance().getSelector('.node'));
    const nodes = this.nodes.getNodes();
    this.board.getInstance().manageAll(nodes);


    //! Refactor
    for (const element of [nodes]) {
      this.board.getInstance().addSourceSelector('.linkAction',{
        anchor: 'Continuous',
        endpoint: "Dot",
        paintStyle:{
          stroke:'#030303',
          fill: '#030303',
          strokeWidth: 1,
        },
        connectorStyle: {
          stroke: "#030303",
          strokeWidth: 2
        }
      })
      this.board.getInstance().addTargetSelector('.node',{
        anchor: 'Continuous',
        endpoint: "Dot",
        paintStyle:{
          stroke:'#030303',
          fill: '#030303',
          strokeWidth: 1,
        },
        connectorStyle: {
          stroke: "#030303",
          strokeWidth: 2
        }
      })
    }
    //!

    //! Refactor
    this.board.getInstance().bind(jsplumb.EVENT_ELEMENT_MOUSE_DOWN, (element:Element) =>{
      if(element.className.includes('resizeButton')) {
        this.draggable = false;
        const def:jsplumb.BrowserJsPlumbDefaults = this.board.getInstance().defaults
        def.elementsDraggable = false
        this.board.getInstance().importDefaults(def)
        if(element.parentElement) {
          this.board.activeResizeElement = element.parentElement
        }
      }
    })

    this.board.getInstance().bind(jsplumb.EVENT_ELEMENT_DBL_CLICK, (element:Element) =>{
        if(this.activeNode != element) {
          this.toggleActiveNote()
        }
        let dragDiv = element.querySelector('.dragDiv')
        if(dragDiv) {
          dragDiv.className += dragDiv.className.includes('hidden') ? '' : ' hidden'
        }
        let desc:HTMLElement | null = element.querySelector('.desc')
        desc?.removeAttribute('readonly')
        desc?.removeAttribute('disabled')

        if(desc && desc instanceof HTMLElement) {
          desc.focus()
        }
    })

    this.board.getInstance().bind(jsplumb.INTERCEPT_BEFORE_DROP,(params: jsplumb.BeforeDropParams)=>{
      const source = this.board.getInstance().getManagedElement(params.sourceId)
      const target = this.board.getInstance().getManagedElement(params.targetId)
      this.board.getInstance().connect({
        source,
        target,
        connector: 'Bezier',
        color: '#000000',
        anchor: 'Continuous',
        endpointStyle: {
          fill: '#030303',
          stroke:  '#030303',
          strokeWidth: 1,
        }

      })

    })
    //!

  }

}

