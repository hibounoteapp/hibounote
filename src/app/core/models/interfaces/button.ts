import { EventEmitter } from "@angular/core"

export interface Button {
  elementType: 'button' | 'a' | 'submit',
  customStyles?: string,
  text: string,
  routerLink?:string,
  theme: 'btn-primary' | 'btn-secondary',
  click?: EventEmitter<Event>,
  icon?: string,
  url?:string,
}
