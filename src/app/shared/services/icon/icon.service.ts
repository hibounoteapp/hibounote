import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Icon } from '@custom-interfaces/icon';

@Injectable({
  providedIn: 'root'
})
export class IconService {
  source: Icon[] = [
    {
      name: "info",
      url: "../../../../assets/icons/info-outline.svg"
    },
    {
      name: "search",
      url: "../../../../assets/icons/search-outline.svg"
    },
    {
      name: "person",
      url: "../../../../assets/icons/person-outline.svg"
    },
    {
      name: "color_fill",
      url: "../../../../assets/icons/color-fill-outline.svg"
    },
    {
      name: "clipboard",
      url: "../../../../assets/icons/clipboard-outline.svg"
    },
    {
      name: "trash",
      url: "../../../../assets/icons/trash-outline.svg"
    },
    {
      name: "menu",
      url: "../../../../assets/icons/menu-outline.svg"
    },
    {
      name: "note",
      url: "../../../../assets/icons/note-outline.svg"
    },
    {
      name: "folder",
      url: "../../../../assets/icons/folder-outline.svg"
    },
    {
      name: "return",
      url: "../../../../assets/icons/return-outline.svg"
    },
    {
      name: "github",
      url: "../../../../assets/icons/logo-github.svg"
    },
    {
      name: "linkedin",
      url: "../../../../assets/icons/logo-linkedin.svg"
    },
    {
      name: "link",
      url: "../../../../assets/icons/link-outline.svg"
    },
    {
      name: "resize",
      url: "../../../../assets/icons/resize-outline.svg"
    },
    {
      name: "view",
      url: "../../../../assets/icons/eye-outline.svg"
    },
    {
      name: "close",
      url: "../../../../assets/icons/close-outline.svg"
    },
    {
      name: "edit",
      url: "../../../../assets/icons/edit-outline.svg"
    },
  ]

  constructor(iconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    console.log("Registering icons!")
    this.source.forEach((icon)=>{
      iconRegistry.addSvgIcon(
        icon.name,
        domSanitizer.bypassSecurityTrustResourceUrl(icon.url) //! Only local fetch 'calling this method with untrusted user data exposes your application to XSS security risks!'
      )
   })
  }
}
