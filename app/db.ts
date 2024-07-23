import Dexie, { type EntityTable } from 'dexie';

interface Board{
    id: number;
    name: string;
}
interface Task{
    id:number;
    boardID: number;
    title: string;
}
const db = new Dexie('PeonyDatabase') as Dexie & {
    boards: EntityTable<Board, 'id'
    >;
    tasks: EntityTable<Task,'id'
    >;
};

db.version(1).stores({
    boards: '++id,name',
    tasks: '++id,boardID,title'
});

export type { Board };
export type { Task };
export { db };