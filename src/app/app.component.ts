import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Host, HostListener, OnInit, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as jsplumb from '@jsplumb/browser-ui';
import interact from 'interactjs'
import $, { event } from 'jquery'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements AfterViewInit{

  @ViewChild('main', {static: true}) container!: ElementRef<HTMLElement>;
  @ViewChild('toolbox', {static: true}) toolbox!: ElementRef<HTMLElement>;
  mouseX: number = 0;
  mouseY: number = 0;
  @HostListener('window:mousemove',['$event'])
    onMouseMove(event: MouseEvent) {
      this.resizeElement(event)
    }

  @HostListener('dragstart',['$event'])
    onDragStart(event: DragEvent) {
      if(event.target instanceof Element && event.dataTransfer) {
        event.dataTransfer.setData('text',event.target.id);
        event.dataTransfer.effectAllowed = 'move';
      }
      console.log(event)
    }
  @HostListener('dragend',['$event'])
    onDragEnd(event: DragEvent) {}

  instance!: jsplumb.JsPlumbInstance;
  toolboxInstance!: jsplumb.JsPlumbInstance;
  allNodes: any[]=[];
  zoom: number= 1;
  draggable: boolean = true;
    activeResizeElement: HTMLElement | undefined;
  droppable: boolean = false;

  constructor(private renderer: Renderer2) {
  }


  dragOverBoard($event: DragEvent) {
    this.droppable = true
    $event.preventDefault();
    if($event.dataTransfer?.dropEffect) {
      $event.dataTransfer.dropEffect = 'move';
    }
  }

  collapseGroup($event: Event) {
    const group = this.instance.getGroupFor($event.target)
    this.instance.collapseGroup(group)

  }

  resizeMouseDown($event: MouseEvent) {
    this.draggable = false
  }

  resizeMouseUp($event: MouseEvent) {
    this.draggable = true
  }

  resizeElement(event: MouseEvent) {
    this.mouseX = event.clientX
    this.mouseY = event.clientY

    if(!this.draggable) {
      const groupId = this.instance.getId(this.activeResizeElement?.parentElement)
      if(groupId.toString() != 'jsplumb-1-1') {
        const element: Element | null = this.instance.getManagedElement(groupId)
        const groupidtop = element ? Number(getComputedStyle(element).top.replace(/([a-z])/g, '')): 0;
        const groupidleft = element ? Number(getComputedStyle(element).left.replace(/([a-z])/g, '')): 0;
        this.mouseX= this.mouseX - groupidleft
        this.mouseY= this.mouseY - groupidtop
      }

      if(this.activeResizeElement?.style) {

        let position = {
          top: Number(this.activeResizeElement.style.top.replace(/([a-z])/g, '')),
          left: Number(this.activeResizeElement.style.left.replace(/([a-z])/g, ''))
        }
        this.activeResizeElement.style.width= `${this.mouseX - position.left + 10}px`
        this.activeResizeElement.style.height= `${this.mouseY - position.top + 10}px`
      }
    }
  }

  createNode(x:number, y:number, type: string) {
    let div = document.createElement('div');
    div.style.minWidth= '100px'
    div.style.maxWidth= '300px'
    div.style.minHeight= '100px'
    div.style.maxHeight= '300px'
    if(type == 'note') {
      div.style.backgroundColor = '#00f00f'
    }

    if(type == 'to-do') {
      div.style.backgroundColor = '#00ffff'
    }

    if(type == 'title') {
      div.style.backgroundColor = '#ff0d0f'
    }
    div.style.position = 'absolute'
    div.style.top = `${y}px`;
    div.style.left = `${x}px`;


    div.className = 'node'


    this.container.nativeElement.appendChild(div)
    this.instance.manage(div)

  }


  dragDrop($event: DragEvent) {
    if($event.dataTransfer?.dropEffect) {
      $event.dataTransfer.dropEffect = 'move';
      if($event.target instanceof Element) {
        this.createNode($event.x, $event.y, $event.dataTransfer.getData('text'))
      }
    }
  }

  ngAfterViewInit(): void {
    this.container.nativeElement.addEventListener('dragover',this.dragOverBoard,false)
    this.container.nativeElement.addEventListener('drop',this.dragDrop,false)
    this.instance = jsplumb.newInstance({
      container: this.container.nativeElement,
      elementsDraggable: true,

    });

    const nodes = this.instance.getSelector(".node")
    this.instance.manageAll(nodes);

    this.instance.addGroup({el:nodes[3], droppable: false, constrain: true, id: "GROUP"})

    this.instance.addToGroup('GROUP',nodes[4])

    for (const element of [nodes]) {
      this.instance.addSourceSelector('.linkAction',{
        anchor: 'Continuous',
        endpoint: "Dot",
      })
      this.instance.addTargetSelector('.node',{
        anchor: 'Continuous',
        endpoint: "Dot",
      })
    }

    this.instance.bind(jsplumb.EVENT_ELEMENT_MOUSE_DOWN, (element:Element) =>{
      if(!this.draggable) {
        const def:jsplumb.BrowserJsPlumbDefaults = this.instance.defaults
        def.elementsDraggable = false
        this.instance.importDefaults(def)
        if(element.parentElement) {
          this.activeResizeElement = element.parentElement
        }
      }
    })

    this.instance.bind(jsplumb.INTERCEPT_BEFORE_DROP,(params: jsplumb.BeforeDropParams)=>{
      const source = this.instance.getManagedElement(params.sourceId)
      const target = this.instance.getManagedElement(params.targetId)

      this.instance.connect({
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
