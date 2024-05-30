import { Injectable, OnInit } from '@angular/core';
import { Board } from '../interfaces/board';
import { BoardService } from './board.service';
import { ActivatedRoute } from '@angular/router';
import { uuid } from '@jsplumb/browser-ui';

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
  ) {

  }

  createBoard() {
    this.boards.push({
      id: uuid(),
      connetions: [],
      elements: [],
      groups: []
    })

  }

  getData(id: string) {
    return this.boards.find(element => element.id === id)
  }

  ngOnInit(): void {
    this.activeId = this.activatedRoute.snapshot.paramMap.get('id') ?? 'null';
  }
}
