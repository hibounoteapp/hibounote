import { Injectable } from '@angular/core';
import { Icon } from '../interfaces/icon';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class IconService {
  source: Icon[] = [
    {
      name: 'resize',
      url: '../assets/resize-outline.svg'
    },
    {
      name: 'pin',
      url: '../assets/pin-outline.svg'
    },
    {
      name: 'reader',
      url: '../assets/reader-outline.svg'
    },
    {
      name: 'zoom-in',
      url: '../assets/zoom-in.svg'
    },
    {
      name: 'zoom-out',
      url: '../assets/zoom-out.svg'
    },
    {
      name: 'maximize',
      url: '../assets/maximize.svg'
    },
  ]

  registerIcons(iconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    this.source.forEach((icon)=>{
      iconRegistry.addSvgIcon(
        icon.name,
        domSanitizer.bypassSecurityTrustResourceUrl(icon.url) //! Only local fetch 'calling this method with untrusted user data exposes your application to XSS security risks!'
      )
    })
  }

  constructor() { }
}
