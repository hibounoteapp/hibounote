import { Component, Renderer2 } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { ManagedElement, UINode } from '@jsplumb/browser-ui';
import { BoardDataService } from '../../services/board-data.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IconService } from '../../services/icon.service';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'navbar-component',
  standalone: true,
  imports: [RouterModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  constructor(
    public boardService: BoardService,
    public boardData: BoardDataService,
    public activeRoute: ActivatedRoute,
    private renderer: Renderer2,
    private iconService: IconService,
    private iconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {
    iconService.registerIcons(iconRegistry, domSanitizer);
  }

  saveData() {
    const elements = this.boardService.instance.getManagedElements()
    

    const connections = this.boardService.instance.getConnections({
      scope: '*',
    })
    const id = this.activeRoute.snapshot.queryParamMap.get('id')
    let board = this.boardData.boards.find(element=>element.id === id)

    if(board?.elements) board.elements=[]
    if(board?.groups) board.groups=[]
    if(board?.connetions) board.connetions=[]

    if(board) {
      board.connetions = connections;

      for (const key in elements) {
        const element = elements[key].el
        if(element instanceof HTMLElement) {
          try {
            const groupElement = elements[key].el._jsPlumbGroup;
            const groupId = groupElement.elId;
            const children: {id:string| null}[] = [];

            groupElement.children.forEach((subElement: UINode<Element>)=>{
              const childId = subElement.el.getAttribute('data-jtk-managed')
              children.push({
                id: childId,
              })
            })

            board.groups.push({
              groupId,
              children
            })

          } catch (error) {}

          board.elements.push({
            element,
            id: this.boardService.instance.getId(element)
          })
        }
      }

      board.zoomScale = this.boardService.panzoom.getScale();
    }


  }

  getData(){

  }
}
