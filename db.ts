// db.ts
import { Board } from '@custom-interfaces/board';
import Dexie, { Table } from 'dexie';

export class AppDB extends Dexie {
  boards!: Table<Board, string>

  constructor() {
    super('ngdexieliveQuery');
    this.version(1).stores({
      boards: 'id'
    });
  }
}

export const db = new AppDB();
