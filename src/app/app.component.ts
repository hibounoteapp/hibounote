import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as jsplumb from '@jsplumb/browser-ui'
import $ from 'jquery';


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

  constructor(private renderer: Renderer2) {}

  collapseGroup($event: Event) {
    const group = this.instance.getGroupFor($event.target)
    this.instance.collapseGroup(group)

  }

  ngAfterViewInit(): void {
    this.instance = jsplumb.newInstance({
      container: this.container.nativeElement,

    });
    const nodes = this.instance.getSelector(".node")
    this.instance.manageAll(nodes);



    this.instance.addGroup({el:nodes[2], droppable: false, constrain: true, id: "GROUP"})

    this.instance.addToGroup('GROUP',nodes[3])

    for (let index = 0; index < nodes.length; index++) {
      const element = nodes[index];
      const link = element.firstChild
      this.instance.addSourceSelector('.linkAction',{
        anchor: 'Continuous',
        endpoint: "Dot",
      })
      this.instance.addTargetSelector('.node',{
        anchor: 'Continuous',
        endpoint: "Dot",
      })
    }

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
