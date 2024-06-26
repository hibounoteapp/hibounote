import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { IconService } from '@shared-services/icon/icon.service';

@Component({
  selector: 'app-simple-button',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatIcon
  ],
  templateUrl: './simple-button.component.html',
  styleUrl: './simple-button.component.scss'
})
export class SimpleButtonComponent{
  @Input() routerLink?: string;
  @Input() url?: string;
  @Input() id?: string;
  @Input() text!: string;
  @Input() theme?: 'btn-primary' | 'btn-secondary' | 'btn-warn';
  @Input() customStyles?: string;
  @Input() elementType!: 'button' | 'a' | 'submit';
  @Input() width?: string;
  @Input() height?: string;
  @Output('click') click = new EventEmitter<Event>();
  @Input() icon?: string;

  constructor(iconService: IconService){}
}
