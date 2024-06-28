import { Injectable, OnInit, Renderer2 } from '@angular/core';
import { Board } from '../../../core/models/interfaces/board';
import { BoardService } from '../board/board.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Connection, Overlay, OverlaySpec, UINode, uuid } from '@jsplumb/browser-ui';
import { NodeService } from '../../../features/board/services/node/node.service';
import { CookieService } from 'ngx-cookie-service';
import { CookiesService } from '@core-services/cookies/cookies.service';
import kanban from '@core-board-templates/kanban';
import sprintRetrospective from '@core-board-templates/sprint-retrospective';
import { TemplateBoard } from '../../../core/models/types/template-board';
import sprintRetro2 from '@core-board-templates/sprint-retrospective2';
import sprintRetro from '@core-board-templates/sprint-retrospective';
import useCase from '@core-board-templates/usecase';
import Dexie from 'dexie';
import { db } from '../../../../../db';
import { SavedConnection } from '@custom-interfaces/saved-connection';
import { SavedNode } from '@custom-interfaces/saved-node';
import { Tag } from '@custom-interfaces/tag';

@Injectable({
  providedIn: 'root'
})
export class BoardDataService implements OnInit{

  _boards: Board[] = [];
  activeId!: string;
  renderer!: Renderer2;


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
    private cookiesService: CookiesService,
  ) {
    this.activatedRoute.queryParamMap.subscribe((p)=>{
      this.activeId = p.get("id") ?? '';
    })

    this.loadBoards();
  }

  loadBoards() {
    this.getBoards().then((res)=>{
      this.boards = res;
      console.log(res)
      this.checkData(this.renderer)
    });
  }

  async getBoards():Promise<Board[]> {
    return await db.boards.toArray()
  }

  checkData( renderer: Renderer2) {
    if(!this.cookiesService.accepted) return
    const id = this.activatedRoute.snapshot.queryParamMap.get('id') ?? ''
    const activeBoard: Board | undefined = this.getData(id)

    if(activeBoard) {
      const scale = activeBoard.zoomScale;
      this.boardService.zoomScale = scale
      this.boardService.panzoom.zoom(scale);
      this.boardService.instance.setZoom(scale);
      this.boardService.translation = this.boardService.panzoom.getPan()

      if(activeBoard.elements) {
        activeBoard.elements.forEach((e:SavedNode)=>{
          const x = e.x * activeBoard.zoomScale;
          const y = e.y * activeBoard.zoomScale;
          const width = e.width;
          const height = e.height;
          const color = e.color;
          const innerText = e.innerText ?? '';
          const type = e.type;
          const nodeId = e.id;

          this.nodeService.loadNode(x,y,width,height,color,innerText,type,renderer,nodeId)
        })
      }

      if(activeBoard.connetions) {
        activeBoard.connetions.forEach((c: SavedConnection)=>{
          let source;
          try { //? Check if source element is a group, since the group Id and Element Id are different
            source = this.boardService.instance.getGroup(c.sourceId).el;
          } catch (error) {
            source = this.boardService.instance.getManagedElement(c.sourceId);
          }

          let target
          try {//?
            target = this.boardService.instance.getGroup(c.targetId).el;
          } catch (error) {
            target = this.boardService.instance.getManagedElement(c.targetId);
          }

          const anchor = c.anchor;
          const connector = c.connector;
          const paintStyle = c.paintStyle;
          const hoverPaintStyle = c.hoverPaintStyle
          const endpointStyle = c.endpointStyle
          let overlays:OverlaySpec[]=[];
          c.overlays.forEach((overlay)=>{
            	let overlayConfig:OverlaySpec;
              if(overlay.label.inputValue != '') {
                overlayConfig = {
                  type: 'Custom',
                  options: {
                    create: ()=>{
                      const label: HTMLInputElement = renderer.createElement('input');
                      label.value = overlay.label.inputValue;
                      renderer.setAttribute(label, 'class', 'labelConnection');
                      renderer.setAttribute(label,'type','text');
                      return label;
                    },
                    location: 0.5,
                  }
                }
                overlays.push(overlayConfig);
              }
          })

          this.boardService.instance.connect({
            anchor,
            connector,
            source,
            target,
            paintStyle,
            hoverPaintStyle,
            endpointStyle,
            overlays,
          })
        })
      }

      if(activeBoard.groups) {

        activeBoard.groups.forEach(e=>{
          const group = this.boardService.instance.getGroup(e.groupId??'');
          const children = e.children.map((child)=>{
            return this.boardService.instance.getManagedElement(child.id??'')
          })

          children.forEach((c:HTMLElement)=>{
            if(group.el instanceof HTMLElement) {
              const top = Number(c.style.top.replace(/[a-z]/g,'')) + Number(group.el.style.top.replace(/[a-z]/g,''));
              const left = Number(c.style.left.replace(/[a-z]/g,'')) + Number(group.el.style.left.replace(/[a-z]/g,''));
              renderer.setStyle(c, 'top',`${top}px`)
              renderer.setStyle(c, 'left',`${left}px`)
            }
            this.boardService.instance.addToGroup(group,c);
          })
        })

      }
    }
  }

  createBoard(board?: Board) {
    const id = uuid();

    if(board) {
      this.boards.push({
        id,
        dateCreated: board.dateCreated,
        name: board.name,
        connetions: board.connetions,
        elements: board.elements,
        groups: board.groups,
        zoomScale: 1,
        favorite: board.favorite,
        tag: board.tag,
      })
    } else {
      this.boards.push({
        id,
        dateCreated: new Date(),
        name: `Untitled board`,
        connetions: [],
        elements: [],
        groups: [],
        zoomScale: 1,
      })

    }

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

  createBoardFromTemplate(
    template:
    "sprint-retro" |
    "kanban" |
    "useCase" |
    "sprint-retro2"
  ) {

    let templateBoard: TemplateBoard = kanban;

    switch (template) {
      case "sprint-retro":
        templateBoard = sprintRetro;
        break;

      case "sprint-retro2":
        templateBoard = sprintRetro2;
        break;

      case "useCase":
        templateBoard = useCase;
        break;

      case "kanban":
        templateBoard = kanban;
        break;
      default:

        break;
    }

    const id = uuid();
    this.boards.push({
      id,
      dateCreated: new Date(),
      name: templateBoard.name,
      connetions: templateBoard.connetions,
      elements: templateBoard.elements,
      groups: templateBoard.groups,
      zoomScale: templateBoard.zoomScale,
    })

    this.router.navigate(['/board'], {
      queryParams: {
        id,
      }
    })

  }

  async saveData() {
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

      const boardInDb = await db.boards.get(board.id)

      if(boardInDb) {
        console.log(boardInDb)
        await db.boards.update(board.id,{
          name: board.name,
          connetions: board.connetions,
          elements: board.elements,
          groups: board.groups,
          zoomScale: board.zoomScale
        })
      } else {
        console.log(JSON.stringify(board))
        await db.boards.add(board);
      }
    }


    // localStorage.setItem("boards",JSON.stringify(this.boards))
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
    db.boards.delete(id);
  }

  toggleFavorite(id: string) {

    let newBoards: Board[] = this.boards.map(element=>{
      if(element.id === id) {
        if(element.favorite) {
          element.favorite = !element.favorite;

        } else {
          element.favorite = true;
        }

        db.boards.update(id, {
          favorite: element.favorite
        });
      }
      return element
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
    db.boards.update(id, {
      name,
    });
    
    this.boards = newBoards;
  }

  toggleTag(tag: Tag,id: string) {
    let board = this.boards.find(e=>e.id===id)
    if(!board) return

    if(board.tag) {
      let selectedTag = board.tag.find(e=>e.id === tag.id)
      console.log(selectedTag)
    } else {
      board.tag = [tag]
    }
  }

  ngOnInit(): void {
    this.activeId = this.activatedRoute.snapshot.paramMap.get('id') ?? 'null';
  }
}
