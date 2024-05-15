import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as jsplumb from '@jsplumb/browser-ui';
import interact from 'interactjs'
import $ from 'jquery'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements AfterViewInit{

  @ViewChild('main', {static: true}) container!: ElementRef<HTMLElement>;
  mouseX: number = 0;
  mouseY: number = 0;
  @HostListener('window:mousemove',['$event'])
    onMouseMove(event: MouseEvent) {
      this.resizeElement(event)
    }


  instance!: jsplumb.JsPlumbInstance;
  allNodes: any[]=[];
  zoom: number= 1;
  draggable: boolean = true;
    activeResizeElement: HTMLElement | undefined;

  constructor(private renderer: Renderer2) {}

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

  createNode() {
    let div = document.createElement('div');
    div.style.minWidth= '100px'
    div.style.maxWidth= '300px'
    div.style.minHeight= '100px'
    div.style.maxHeight= '300px'
    div.style.backgroundColor = '#00f00f'
    div.style.position = 'absolute'
    div.className = 'node'


    this.container.nativeElement.appendChild(div)
    this.instance.manage(div)

  }



  ngAfterViewInit(): void {
    this.instance = jsplumb.newInstance({
      container: this.container.nativeElement,
      elementsDraggable: true,

    });


    const nodes = this.instance.getSelector(".node")
    this.instance.manageAll(nodes);



    this.instance.addGroup({el:nodes[2], droppable: false, constrain: true, id: "GROUP"})

    this.instance.addToGroup('GROUP',nodes[3])

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

    // this.instance.bind(jsplumb.EVENT_DRAG_MOVE, ($event: Event)=>{
    //   console.log("Move")
    // })



    this.instance.bind(jsplumb.EVENT_DRAG_MOVE, (drag: jsplumb.DragMovePayload) =>{
      // let top:number = drag.originalPosition.y
      // let left:number = drag.originalPosition.x
      // console.log(top, left)
      // if(!this.draggable) {
      //   let mouseX:number = drag.e instanceof MouseEvent? drag.e.clientX : 0
      //   let mouseY:number = drag.e instanceof MouseEvent? drag.e.clientY : 0

      //   if(drag.el instanceof Element) {
      //     const groupId = this.instance.getId(drag.el.parentElement)
      //     if(groupId.toString() != 'jsplumb-1-1') {
      //       const element: Element | null = this.instance.getManagedElement(groupId)
      //       console.log(element)
      //       const groupidtop = Number(getComputedStyle(element!).top.replace(/([a-z])/g, ''));
      //       const groupidleft = Number(getComputedStyle(element!).left.replace(/([a-z])/g, ''));
      //       mouseX= mouseX - groupidleft
      //       mouseY= mouseY - groupidtop
      //     }
      //   }
      //   let width: number = mouseX-left+10
      //   let height: number = mouseY-top+10
      //   // if(
      //   //   mouseX-left< Number(getComputedStyle(drag.el!).minWidth.replace(/([a-z])/g, '')) ||
      //   //   mouseX-left> Number(getComputedStyle(drag.el!).maxWidth.replace(/([a-z])/g, '')) ||
      //   //   mouseY-top< Number(getComputedStyle(drag.el!).minHeight.replace(/([a-z])/g, '')) ||
      //   //   mouseY-top< Number(getComputedStyle(drag.el!).maxHeight.replace(/([a-z])/g, ''))) {
      //   //   return
      //   // }
      //   drag.el.setAttribute('style',
      //   `width: ${width}px; height: ${height}px;left: ${left}px; top: ${top}px`
      //   )
      // }
    })

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

    this.instance.bind(jsplumb.EVENT_DRAG_STOP, (drag: jsplumb.DragMovePayload) =>{





      // let top:number = drag.originalPosition.y
      // let left:number = drag.originalPosition.x

      // console.log(top, left)
      // if(!this.draggable) {
      //   let mouseX:number = drag.e instanceof MouseEvent? drag.e.clientX : 0
      //   let mouseY:number = drag.e instanceof MouseEvent? drag.e.clientY : 0

      //   if(drag.el instanceof Element) {
      //     const groupId = this.instance.getId(drag.el.parentElement)
      //     if(groupId.toString() != 'jsplumb-1-1') {
      //       const element: Element | null = this.instance.getManagedElement(groupId)
      //       console.log(element)
      //       const groupidtop = Number(getComputedStyle(element!).top.replace(/([a-z])/g, ''));
      //       const groupidleft = Number(getComputedStyle(element!).left.replace(/([a-z])/g, ''));
      //       mouseX= mouseX - groupidleft
      //       mouseY= mouseY - groupidtop
      //     }
      //   }
      //   let width: number = mouseX-left+10
      //   let height: number = mouseY-top+10
      //   // if(
      //   //   mouseX-left< Number(getComputedStyle(drag.el!).minWidth.replace(/([a-z])/g, '')) ||
      //   //   mouseX-left> Number(getComputedStyle(drag.el!).maxWidth.replace(/([a-z])/g, '')) ||
      //   //   mouseY-top< Number(getComputedStyle(drag.el!).minHeight.replace(/([a-z])/g, '')) ||
      //   //   mouseY-top< Number(getComputedStyle(drag.el!).maxHeight.replace(/([a-z])/g, ''))) {
      //   //   return
      //   // }
      //   drag.el.setAttribute('style',
      //   `width: ${width}px; height: ${height}px;left: ${left}px; top: ${top}px`
      //   )
      // }
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





    // this.instance.connect({
    //   anchor: 'Continuous',
    //   source: nodes[1],
    //   target: nodes[3],
    //   overlays: [{
    //     type: "Label",
    //     options: {
    //       location: 0.5,
    //       label: "New Connection",
    //       events:{
    //         click:(e:Event, o: jsplumb.Overlay) => alert("CLIKED")
    //       }
    //     }
    //   }]
    // })

    // this.instance.connect({
    //   anchor: 'Continuous',
    //   connector: {
    //     type: "Flowchart",
    //     options: {
    //       curviness: 10
    //     }
    //   },
    //   overlays: [
    //     {
    //       type: 'Label',
    //       options: {
    //         location: 0.5,
    //         label: "Connection 1"
    //       }
    //     },
    //     {
    //       type: "PlainArrow",
    //       options:{location: 0.6}
    //     }

    //   ],
    //   source:nodes[0],
    //   target: nodes[1]
    // })
  }

}
