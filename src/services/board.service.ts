import { ElementRef, Injectable, Renderer2, ViewChildren, inject } from '@angular/core';
import * as jsplumb from '@jsplumb/browser-ui'
import Panzoom, { PanzoomObject } from '@panzoom/panzoom';
import { NodeService } from './node.service';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  _instance!: jsplumb.JsPlumbInstance;
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

  public get instance() : jsplumb.JsPlumbInstance {
    return this._instance;
  }

  public set instance(instance : jsplumb.JsPlumbInstance) {
    this._instance = instance;
  }

  dragOverBoard(event: DragEvent) {
    event.preventDefault();
    if(event.dataTransfer?.dropEffect) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  zoomClick(type: 'in' | 'out') {
    if(type === 'in') this.panzoom.zoomIn()
    if(type === 'out') this.panzoom.zoomOut()
    const scale = this.panzoom.getScale()
    this.zoomScale = scale
    this.instance.setZoom(scale)
    this.translation = this.panzoom.getPan()
  }

  zoom = (event: WheelEvent) => {
    if(!event.shiftKey) return

    this.panzoom.zoomWithWheel(event)
    const scale = this.panzoom.getScale()
    this.zoomScale = scale
    this.instance.setZoom(scale)
    this.translation = this.panzoom.getPan()
  }

  resetPan = () => {
    this.panzoom.pan(0,0,{
      animate: true,
    })
    this.panzoom.zoom(1,{
      animate: true
    })
    const scale = this.panzoom.getScale()
    this.zoomScale = scale
    this.instance.setZoom(scale)
    this.translation = this.panzoom.getPan()
  }

  enablePanzoom = () => {
    this.panzoom.bind()
    this.panzoom.setOptions({
      cursor: '',

    })
  }

  disablePanzoom = () => {
    this.panzoom.destroy()
    this.panzoom.setOptions({
      cursor:'',
    })
  }

  dropNode = (event: DragEvent, nodeService: NodeService, container: ElementRef, renderer: Renderer2) => {
    if(event.dataTransfer?.dropEffect) {
      event.dataTransfer.dropEffect = 'move';
      if(event.target instanceof Element) {
        const node = nodeService.createNode(event.x, event.y, event.dataTransfer.getData('text'), renderer)
        const abstractElement = renderer.selectRootElement(container,true)
        renderer.appendChild(abstractElement.nativeElement, node)

        this.instance.manage(node)
        this.enablePanzoom()
      }
    }
  }

  pointerDownNode = (event: PointerEvent, nodeService: NodeService,renderer: Renderer2) => { //? Handling click event in node
    if(!(event.target instanceof Element)) return
    const abstractElement = renderer.selectRootElement(event.target,true)
    const targetClass = abstractElement.className
    this.disablePanzoom()

    console.log("Node: DOWN: ", event.target)
    let element: Element | undefined;

    if(abstractElement.parentElement?.className.includes('nodeContainer')) {
      element = abstractElement.parentElement;
    }
    if(targetClass.includes('nodeContainer')) {
      element = abstractElement;
    }

    if(element) {
      if(element != nodeService.activeNode) nodeService.clearActiveNote(renderer)
      if(!element.className.includes('activeNode')) element.className += ' activeNode'
      nodeService.activeNode = element;
    }
  }

  pointerDownConnection = (event: PointerEvent) => { //? Handling click event in connection
    if(!(event.target instanceof Element)) return
    this.disablePanzoom()
  }

  pointerDown = (event: PointerEvent, nodeService: NodeService, renderer:Renderer2) => {
    console.log("Pointer: DOWN: ", event.target)
    const abstractDocument:Document = renderer.selectRootElement(document, true)
    if(abstractDocument.activeElement && abstractDocument.activeElement instanceof HTMLElement) abstractDocument.activeElement.blur()

    if(!(event.target instanceof Element)) return
    const abstractElement = renderer.selectRootElement(event.target,true)

    if(abstractElement.tagName=='circle'){
      this.pointerDownConnection(event)
      return
    }


    if(abstractElement.className.includes('nodeContainer') || abstractElement.className.includes('nodeElement') || abstractElement.className.includes('connection')) {
      this.pointerDownNode(event,nodeService,renderer);
      return
    }

    nodeService.clearActiveNote(renderer);
  }

  pointerUp = (event: Event) => {
    this.enablePanzoom()
    this.translation = this.panzoom.getPan()
  }

  bindJsPlumbEvents = (nodeService: NodeService, renderer:Renderer2) => {

    this.instance.bind(jsplumb.EVENT_ELEMENT_MOUSE_DOWN, (element:Element) =>{
      const abstractElement = renderer.selectRootElement(element,true)
      if(abstractElement.className.includes('resizeButton')) {
        this.draggable = false;
        const def:jsplumb.BrowserJsPlumbDefaults = this.instance.defaults
        def.elementsDraggable = false
        this.instance.importDefaults(def)
        if(abstractElement.parentElement) {
          this.activeResizeElement = abstractElement.parentElement
        }
      }
    })

    this.instance.bind(jsplumb.EVENT_ELEMENT_DBL_CLICK, (element:Element) => {
      if(nodeService.activeNode != element) nodeService.clearActiveNote(renderer);

      const abstractElement:Element = renderer.selectRootElement(element, true)

      let dragDiv:Element | null = abstractElement.querySelector('.dragDiv')
      if(dragDiv && !dragDiv.className.includes('hidden')) {
        renderer.addClass(dragDiv,'hidden')
      }

      let desc:Element | null = abstractElement.querySelector('.desc')
      if(desc?.getAttribute('readonly') != '' || desc?.getAttribute('disabled') != ''){
        renderer.removeAttribute(desc, 'readonly')
        renderer.removeAttribute(desc, 'disabled')
      }

      if(desc && desc instanceof HTMLElement) {
        desc.focus()
      }
    })

    this.instance.bind(jsplumb.INTERCEPT_BEFORE_DROP,(params: jsplumb.BeforeDropParams)=>{
      const source = this.instance.getManagedElement(params.sourceId)
      const target = this.instance.getManagedElement(params.targetId)
      if(source === target) return
      this.instance.connect({
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

  connectorsConfiguration = () => {
    this.instance.addSourceSelector('.linkAction',{
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
    this.instance.addTargetSelector('.node',{
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

  init = (container: ElementRef, nodeService: NodeService, renderer: Renderer2) => {
    const abstractElement = renderer.selectRootElement(container)
    this.panzoom = Panzoom(abstractElement.nativeElement, {
      canvas: true,
      cursor: '',
      minScale: 0.4,
      maxScale: 1.5
    })
    this.translation = this.panzoom.getPan()

    const jsInstance = jsplumb.newInstance({
      container: abstractElement.nativeElement,
      elementsDraggable: true,
    });
    this.instance = jsInstance;

    this.connectorsConfiguration()
    this.bindJsPlumbEvents(nodeService, renderer)
  }
}
