import { Injectable } from '@angular/core';
import { Board } from '@custom-interfaces/board';
import Dexie, { Table } from 'dexie';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  public dexieDb!:Dexie;
  public boards!: Table<Board,string>;

  constructor() { }

}
