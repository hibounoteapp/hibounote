import { Injectable } from '@angular/core';
import jsplumb from '@jsplumb/browser-ui'

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  instance!: jsplumb.JsPlumbInstance;
  activeResizeElement: HTMLElement | undefined;

  getInstance(): jsplumb.JsPlumbInstance {
    return this.instance
  }

  setInstance(instance: jsplumb.JsPlumbInstance) {
    this.instance = instance;
  }

  constructor() { }
}
