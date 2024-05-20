import { Injectable } from '@angular/core';
import jsplumb from '@jsplumb/browser-ui'
import { PanzoomObject } from '@panzoom/panzoom';

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

  getInstance(): jsplumb.JsPlumbInstance {
    return this.instance
  }

  setInstance(instance: jsplumb.JsPlumbInstance) {
    this.instance = instance;
  }

  constructor() { }
}
