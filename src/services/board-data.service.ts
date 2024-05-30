import { Injectable, OnInit } from '@angular/core';
import { Board } from '../interfaces/board';
import { BoardService } from './board.service';
import { ActivatedRoute } from '@angular/router';
import { UINode, uuid } from '@jsplumb/browser-ui';

@Injectable({
  providedIn: 'root'
})
export class BoardDataService implements OnInit{

  _boards: Board[] = [];
  activeId!: string;


  public get boards() : Board[] {
    return this._boards;
  }


  constructor(
    protected boardService: BoardService,
    protected activatedRoute: ActivatedRoute
  ) {}

  createBoard() {
    this.boards.push({
      id: uuid(),
      connetions: [],
      elements: [],
      groups: [],
      zoomScale: 1,
    })

  }

  saveData() {
    const elements = this.boardService.instance.getManagedElements()
    const connections = this.boardService.instance.getConnections({
      scope: '*',
    })
    const id = this.activatedRoute.snapshot.queryParamMap.get('id')
    let board = this.boards.find(element=>element.id === id)

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

  getData(id: string) {
    return this.boards.find(element => element.id === id)
  }

  ngOnInit(): void {
    this.activeId = this.activatedRoute.snapshot.paramMap.get('id') ?? 'null';
  }
}
