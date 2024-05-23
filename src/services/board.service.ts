import { ElementRef, Injectable, Renderer2, inject } from '@angular/core';
import * as jsplumb from '@jsplumb/browser-ui'
import Panzoom, { PanzoomObject } from '@panzoom/panzoom';
import { NodeService } from './node.service';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  instance!: jsplumb.JsPlumbInstance;
  activeResizeElement: HTMLElement | undefined;
  panzoom!: PanzoomObject;
  translation!: {
    x: number,
    y: number
  }
  zoomScale: number = 1
  droppable: boolean = false;
  draggable: boolean = true;

  constructor() { }

  getInstance(): jsplumb.JsPlumbInstance {
    return this.instance
  }

  setInstance(instance: jsplumb.JsPlumbInstance) {
    this.instance = instance;
  }

  dragOverBoard($event: DragEvent) {
    $event.preventDefault();
    if($event.dataTransfer?.dropEffect) {
      $event.dataTransfer.dropEffect = 'move';
    }
  }

  zoomClick(type: 'in' | 'out') {
    if(type === 'in') this.panzoom.zoomIn()
    if(type === 'out') this.panzoom.zoomOut()
    const scale = this.panzoom.getScale()
    this.zoomScale = scale
    this.getInstance().setZoom(scale)
    this.translation = this.panzoom.getPan()
  }

  zoom = (event: WheelEvent) => {
    if(!event.shiftKey) return

    this.panzoom.zoomWithWheel(event)
    const scale = this.panzoom.getScale()
    this.zoomScale = scale
    this.getInstance().setZoom(scale)
    this.translation = this.panzoom.getPan()

    this.getInstance().repaintEverything()
    console.log(scale)
  }

  resetPan() {
    this.panzoom.pan(0,0,{
      animate: true,
    })
    this.panzoom.zoom(1,{
      animate: true
    })
    const scale = this.panzoom.getScale()
    this.zoomScale = scale
    this.getInstance().setZoom(scale)
    this.translation = this.panzoom.getPan()
  }

  enablePanzoom() {
    this.panzoom.bind()
    this.panzoom.setOptions({
      cursor: '',

    })
  }

  disablePanzoom() {
    this.panzoom.destroy()
  }

  dropNode(event: DragEvent, nodeService: NodeService, container: ElementRef) {
    console.log('drop node')
    if(event.dataTransfer?.dropEffect) {
      event.dataTransfer.dropEffect = 'move';
      if(event.target instanceof Element) {
        const div = nodeService.createNode(event.x, event.y, event.dataTransfer.getData('text'))
        container.nativeElement.appendChild(div)
        this.getInstance().manage(div)
        this.enablePanzoom()
      }
    }
  }

  pointerDownNode = (event: PointerEvent, nodeService: NodeService) => { //? Handling click event in node
    if(!(event.target instanceof Element)) return
    console.log('found node');
    const targetClass = event.target.className
    this.disablePanzoom()
    this.panzoom.setOptions({
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
      if(element != nodeService.activeNode) nodeService.clearActiveNote()
      element.className += element.className.includes('activeNode') ? '':' activeNode'
      nodeService.activeNode = element;
    }
  }

  pointerDownConnection = (event: PointerEvent) => { //? Handling click event in connection
    if(!(event.target instanceof Element)) return

    this.disablePanzoom()
  }

  pointerDown(event: PointerEvent, nodeService: NodeService) {
    console.log(event.target)
      if(document.activeElement && document.activeElement instanceof HTMLElement) document.activeElement.blur()

      if(!(event.target instanceof Element)) return

      if(event.target.tagName=='circle'){
        this.pointerDownConnection(event)
        return
      }


      if(event.target.className.includes('nodeContainer') || event.target.className.includes('nodeElement') || event.target.className.includes('connection')) {
        console.log('Node')
        this.pointerDownNode(event,nodeService);
        return
      }

      console.log('board')
      nodeService.clearActiveNote();
  }

  pointerUp = (event: Event) => {
    console.log('pointer up')
    this.enablePanzoom()
    this.translation = this.panzoom.getPan()
    console.log(this.translation)
  }

  bindJsPlumbEvents(nodeService: NodeService) {

    this.getInstance().bind(jsplumb.EVENT_ELEMENT_MOUSE_DOWN, (element:Element) =>{
      if(element.className.includes('resizeButton')) {
        this.draggable = false;
        const def:jsplumb.BrowserJsPlumbDefaults = this.getInstance().defaults
        def.elementsDraggable = false
        this.getInstance().importDefaults(def)
        if(element.parentElement) {
          this.activeResizeElement = element.parentElement
        }
      }
    })

    this.getInstance().bind(jsplumb.EVENT_ELEMENT_DBL_CLICK, (element:Element) =>{
        if(nodeService.activeNode != element) {
          nodeService.clearActiveNote();
        }
        let dragDiv = element.querySelector('.dragDiv');
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

    this.getInstance().bind(jsplumb.INTERCEPT_BEFORE_DROP,(params: jsplumb.BeforeDropParams)=>{
      const source = this.getInstance().getManagedElement(params.sourceId)
      const target = this.getInstance().getManagedElement(params.targetId)
      if(source === target) return
      this.getInstance().connect({
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
  }

  connectorsConfiguration() {
    this.getInstance().addSourceSelector('.linkAction',{
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
    this.getInstance().addTargetSelector('.node',{
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

  init(container: ElementRef, nodeService: NodeService) {
    this.panzoom = Panzoom(container.nativeElement, {
      canvas: true,
      cursor: '',
      minScale: 0.4,
      maxScale: 1.5
    })
    this.translation = this.panzoom.getPan()

    const jsInstance = jsplumb.newInstance({
      container: container.nativeElement,
      elementsDraggable: true,
    });
    this.setInstance(jsInstance);

    this.connectorsConfiguration()
    this.bindJsPlumbEvents(nodeService)
  }
}
