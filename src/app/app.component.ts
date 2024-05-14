import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild, ViewChildren } from '@angular/core';
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
  instance!: jsplumb.JsPlumbInstance;
  allNodes: any[]=[];
  zoom: number= 1;
  draggable: boolean = true;


  constructor(private renderer: Renderer2) {}

  collapseGroup($event: Event) {
    const group = this.instance.getGroupFor($event.target)
    this.instance.collapseGroup(group)

  }

  resizeMouseDown($event: MouseEvent) {
    this.draggable = false;


  }

  resizeMouseUp($event: MouseEvent) {
    this.draggable = true;
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
      let top:number = drag.originalPosition.y
      let left:number = drag.originalPosition.x
      console.log(top, left)
      if(!this.draggable) {
        let mouseX:number = drag.e instanceof MouseEvent? drag.e.clientX : 0
        let mouseY:number = drag.e instanceof MouseEvent? drag.e.clientY : 0

        if(drag.el instanceof Element) {
          const groupId = this.instance.getId(drag.el.parentElement)
          if(groupId.toString() != 'jsplumb-1-1') {
            const element: Element | null = this.instance.getManagedElement(groupId)
            console.log(element)
            const groupidtop = Number(getComputedStyle(element!).top.replace(/([a-z])/g, ''));
            const groupidleft = Number(getComputedStyle(element!).left.replace(/([a-z])/g, ''));
            mouseX= mouseX - groupidleft
            mouseY= mouseY - groupidtop
          }
        }

          // if(
          //   mouseX-left< Number(getComputedStyle(drag.el!).minWidth.replace(/([a-z])/g, '')) ||
          //   mouseX-left> Number(getComputedStyle(drag.el!).maxWidth.replace(/([a-z])/g, '')) ||
          //   mouseY-top< Number(getComputedStyle(drag.el!).minHeight.replace(/([a-z])/g, '')) ||
          //   mouseY-top< Number(getComputedStyle(drag.el!).maxHeight.replace(/([a-z])/g, ''))) {
          //   return
          // }

          drag.el.setAttribute('style',
          `width: ${mouseX-left+10}px; height: ${mouseY-top+10}px;left: ${left}px; top: ${top}px`
          )



      }

    })

    this.instance.bind(jsplumb.INTERCEPT_BEFORE_DROP,(params: jsplumb.BeforeDropParams)=>{
      const source = this.instance.getManagedElement(params.sourceId)
      const target = this.instance.getManagedElement(params.targetId)

      this.instance.connect({
        source,
        target,
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

    this.instance.connections.forEach(e=>{
      e.addOverlay({
        type: "Label",
        options: {
          location:0.5,
          label: "HELLO"
        }
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
