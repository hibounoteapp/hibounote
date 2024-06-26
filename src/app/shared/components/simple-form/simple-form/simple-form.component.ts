import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ContentChild, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Button } from '@custom-interfaces/button';
import { SimpleButtonComponent } from '@shared-components/simple-button';

interface Field {
  label:string,
  type:string,
  aside?:string,
}

@Component({
  selector: 'app-simple-form',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SimpleButtonComponent
  ],
  templateUrl: './simple-form.component.html',
  styleUrl: './simple-form.component.scss'
})
export class SimpleFormComponent implements AfterContentInit{
  @Input() fields!: Field[];
  @Input() buttons!: Button[];
  @ViewChild('formContainer', {static: true}) container!: ElementRef<HTMLElement>;
  @ContentChild('additionalContent')
  additionalContent?:ElementRef<HTMLElement>;

  constructor(private renderer: Renderer2) {

  }

  ngAfterContentInit(): void {
    if(this.additionalContent){
      this.renderer.appendChild(
        this.container.nativeElement,
        this.additionalContent.nativeElement)
    }
  }
}
