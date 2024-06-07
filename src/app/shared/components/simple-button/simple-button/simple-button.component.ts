import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
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
  @Input() text!: string;
  @Input() visible!: boolean;
  @Input() theme!: 'btn-primary' | 'btn-secondary' | 'btn-warn';
  @Input() customStyles!: string;
  @Input() elementType!: 'button' | 'a' | 'submit';
  @Input() onClick: ()=>void = ()=>{};
}
