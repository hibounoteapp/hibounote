import { Injectable, OnInit } from '@angular/core';
import { Board } from '../../../core/models/interfaces/board';
import { BoardService } from '../board/board.service';
import { ActivatedRoute, Router } from '@angular/router';
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

  public set boards(v : Board[]) {
    this._boards = v;
  }

  constructor(
    protected boardService: BoardService,
    protected activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.activatedRoute.queryParamMap.subscribe((p)=>{
      this.activeId = p.get("id") ?? '';
    })
  }

  createBoard() {

    const id = uuid();

    this.boards.push({
      id,
      dateCreated: new Date(),
      name: `Untitled board`,
      connetions: [],
      elements: [],
      groups: [],
      zoomScale: 1,
    })

    this.router.navigate(['/board'], {
      queryParams: {
        id,
      }
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

  getActiveBoard() {
    return this.getData(this.activeId);
  }

  deleteBoard(id: string) {
    let newBoards: Board[] = this.boards.filter((board: Board)=>{
      if(board.id === id) {
        return false;
      }
      return true;
    })
    this.boards = newBoards;
  }

  editBoardName(id: string, name: string) {
    let newBoards: Board[] = this.boards.map((board: Board)=>{
      if(board.id === id) {
        return {
          ...board,
          name,
        }
      }
      return board
    })
    this.boards = newBoards;
  }

  ngOnInit(): void {
    this.activeId = this.activatedRoute.snapshot.paramMap.get('id') ?? 'null';
  }
}
