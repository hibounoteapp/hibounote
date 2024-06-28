// db.ts
import { Board } from '@custom-interfaces/board';
import Dexie, { Table } from 'dexie';

export class AppDB extends Dexie {
  boards!: Table<Board, string>
  tags!: Table<{
    id: string,
    name: string
  },string>

  constructor() {
    super('ngdexieliveQuery');
    this.version(1).stores({
      boards: 'id',
      tags: 'id'
    });
  }
}

export const db = new AppDB();
