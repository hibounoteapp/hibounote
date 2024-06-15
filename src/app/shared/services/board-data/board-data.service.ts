import { Injectable, OnInit } from '@angular/core';
import { Board } from '../../../core/models/interfaces/board';
import { BoardService } from '../board/board.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Connection, Overlay, UINode, uuid } from '@jsplumb/browser-ui';
import { NodeService } from '../../../features/board/services/node/node.service';
import { CookieService } from 'ngx-cookie-service';
import { CookiesService } from '@core-services/cookies/cookies.service';

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
    protected nodeService: NodeService,
    private router: Router,
    private cookieService: CookieService,
    private cookiesService: CookiesService
  ) {
    this.activatedRoute.queryParamMap.subscribe((p)=>{
      this.activeId = p.get("id") ?? '';
    })
  }

  loadBoards(boards: Board[]) {
    this.boards = boards;
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
    }).then(()=>{
      try {
        this.nodeService.clearAll();
      } catch (error) {}
    })

  }

  saveData() {
    if(!this.cookiesService.accepted) return
    const id = this.activatedRoute.snapshot.queryParamMap.get('id')
    let board = this.boards.find(element=>element.id === id)

    if(board?.elements) board.elements=[]
    if(board?.groups) board.groups=[]
    if(board?.connetions) board.connetions=[]

    if(board) {
      this.saveConnections(board);

      this.saveNodes(board);

      board.zoomScale = this.boardService.panzoom.getScale();
    }

    this.cookieService.set("boards",JSON.stringify(this.boards))
  }

  saveConnections(board: Board){
    const connections = this.boardService.instance.getConnections({
      scope: '*',
    })
    if(connections instanceof Array) {
      connections.forEach((connection: Connection)=>{
        type CustomOverlay2 <T> = Partial<T> & {
          canvas?: HTMLInputElement
        };//? For some reason, JsPlumb 'CustomOverlay' base type don't have the reference for 'canvas', which is necessary to get internal information about the overlay

        const paintStyle = connection.paintStyle;
        const hoverPaintStyle = connection.hoverPaintStyle;
        const endpointStyle = connection.endpointStyle;
        const sourceId = connection.sourceId;
        const targetId = connection.targetId;
        let overlays:{
          label:{
            inputValue:string,
          }
        }[]=[];

        for (const key in connection.overlays) {
          const overlay:CustomOverlay2<Overlay> = connection.overlays[key];
          const inputValue = overlay.canvas?.value ?? '';
          overlays.push({
            label:{
              inputValue,
            }
          })
        }

        board.connetions.push({
          anchor: "Continuous",
          connector: "Bezier",
          sourceId,
          targetId,
          paintStyle,
          hoverPaintStyle,
          endpointStyle,
          overlays
        })
      })
    }
  }

  saveNodes(board: Board){
    const elements = this.boardService.instance.getManagedElements()
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

        const x = Number(element.style.left.replace(/[a-z]/g,''));
        const y = Number(element.style.top.replace(/[a-z]/g,''));
        const width = Number(element.style.width.replace(/[a-z]/g,''));
        const height = Number(element.style.height.replace(/[a-z]/g,''));
        const color = element.style.backgroundColor;
        const innerText = element.querySelector('textarea')?.value ?? null;
        const type = element.classList.contains('nodeGroup') ? 'group' : 'node'
        const id = this.boardService.instance.getId(element);

        board.elements.push({
          x,
          y,
          width,
          height,
          innerText,
          color,
          type,
          id
        })
      }
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
    this.cookieService.set("boards",JSON.stringify(this.boards))
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
