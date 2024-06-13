import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-simple-button',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule
  ],
  templateUrl: './simple-button.component.html',
  styleUrl: './simple-button.component.scss'
})
export class SimpleButtonComponent{
  @Input() routerLink!: string;
  @Input() id?: string;
  @Input() text!: string;
  @Input() visible!: boolean;
  @Input() theme?: 'btn-primary' | 'btn-secondary' | 'btn-warn';
  @Input() customStyles!: string;
  @Input() elementType!: 'button' | 'a' | 'submit';
  @Output('click') click = new EventEmitter<Event>();
}
