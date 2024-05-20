import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Host, HostListener, OnInit, Renderer2, ViewChild, ViewChildren, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as jsplumb from '@jsplumb/browser-ui';
import { NodeService } from '../services/node.service';
import { MouseDirective } from '../directives/mouse.directive';
import { BoardService } from '../services/board.service';
import Panzoom from '@panzoom/panzoom';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, MouseDirective],
  providers: [
    NodeService,
    BoardService,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements AfterViewInit{

  @ViewChild('main', {static: true}) container!: ElementRef<HTMLElement>;
  @ViewChild('toolbox', {static: true}) toolbox!: ElementRef<HTMLElement>;
  @ViewChild('board', {static: true}) boardContainer!: ElementRef<HTMLElement>;
  nodes: NodeService = inject(NodeService);
  mouseX: number = 0;
  mouseY: number = 0;
  board: BoardService = inject(BoardService);
  allNodes: any[]=[];
  zoom: number= 1;
    activeResizeElement: HTMLElement | undefined;
  droppable: boolean = false;
  draggable: boolean = true;

  @HostListener('window:mousemove',['$event'])
    onMouseMove(event: MouseEvent) {
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

  constructor(private renderer: Renderer2) {
  }

  dragOverBoard($event: DragEvent) {
    this.droppable = true
    $event.preventDefault();
    if($event.dataTransfer?.dropEffect) {
      $event.dataTransfer.dropEffect = 'move';
    }
  }

  ngAfterViewInit(): void {
    this.board.panzoom = Panzoom(this.container.nativeElement, {
      canvas: true,
      cursor: '',
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
    }

    const onMouseMove = (event: MouseEvent) => {
       console.log(this.draggable)
      // if(!this.draggable) {
      //   console.log('resize element')
      //   this.nodes.resizeElement(event)
      // }
    }

    const pointerDown = (event: Event) => {
      if(event.target instanceof Element) {
        const targetClass = event.target.className
        if(targetClass.includes('nodeContainer') || targetClass.includes('nodeElement')) {
          disablePanzoom()
        }
      }
    }


    document.addEventListener('pointerup', pointerUp)
    this.toolbox.nativeElement.addEventListener('pointerdown',disablePanzoom)
    this.boardContainer.nativeElement.addEventListener('pointerdown', pointerDown)
    this.boardContainer.nativeElement.addEventListener('mousemove', onMouseMove)
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


    for (const element of [nodes]) {
      this.board.getInstance().addSourceSelector('.linkAction',{
        anchor: 'Continuous',
        endpoint: "Dot",
      })
      this.board.getInstance().addTargetSelector('.node',{
        anchor: 'Continuous',
        endpoint: "Dot",
      })
    }

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

    this.board.getInstance().bind(jsplumb.INTERCEPT_BEFORE_DROP,(params: jsplumb.BeforeDropParams)=>{
      const source = this.board.getInstance().getManagedElement(params.sourceId)
      const target = this.board.getInstance().getManagedElement(params.targetId)
      this.board.getInstance().connect({
        source,
        target,
        connector: 'Bezier',
        anchor: 'Continuous',
        overlays: [
          {
            type: "Custom",
            options: {
              location: 0.5,
              create: (comp: Component) => {
                const d = document.createElement("div")
                d.innerHTML= '<input text class="min-w-20 border-black border-2 text-center bg-gray-200"/>'
                return d
              }
            }
          }
        ]
      })

    })


  }

}
