import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Board } from '../db';
import { LoadTasks } from './tasks';
import { IconContext } from 'react-icons';
import { FaRegTrashAlt } from "react-icons/fa";
interface LoadBoardsProps {
    isAdding: boolean;
    setIsAdding: (isAdding: boolean) => void;
}

export function LoadBoards({ isAdding, setIsAdding }: LoadBoardsProps) {
    const boards = useLiveQuery(() => db.boards.toArray(), []);
    const [editableBoardId, setEditableBoardId] = useState<number | null>(null);
    const [inputValue, setInputValue] = useState<string>('');

    useEffect(() => {
        if (isAdding && boards && boards.length > 0) {
            const newBoard = boards[boards.length - 1];
            setEditableBoardId(newBoard.id);
            setInputValue(newBoard.name);
            setIsAdding(false);
        }
    }, [isAdding, boards, setIsAdding]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };
    const handleBlur = async (id: number) => {
        await db.boards.update(id, { name: inputValue });
        setEditableBoardId(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: number) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur();
        }
    };
    const deleteBoard = async (board_id: number) => {
        await db.tasks.where('boardID').equals(board_id).delete();
        await db.boards.delete(board_id);
    }

    return (
        <>
            {boards?.map((board) => (
                <div className="card card-normal w-96 shadow-md bg-base" key={board.id}>
                    <div className="card-body flex-col">
                        {editableBoardId === board.id ? (
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleNameChange}
                                onBlur={() => handleBlur(board.id)}
                                onKeyDown={(e) => handleKeyDown(e, board.id)}
                                autoFocus
                            />
                        ) : (
                            <h2 className="card-title text-3xl" onClick={() => {
                                setEditableBoardId(board.id);
                                setInputValue(board.name);
                            }}>
                                {board.name || 'New Board'}
                            </h2>
                        )}
                        <div>
                            <LoadTasks board_ID={board.id} />
                            <div>
                                <button className="btn btn-sm btn-neutral mt-4" onClick={() => deleteBoard(board.id)}>
                                    <div className='flex flex-initial items-center gap-2'>
                                        <div className='pb-0.5'>
                                            <IconContext.Provider value={{ size: '15', style: { verticalAlign: 'text-top' } }}>
                                                <FaRegTrashAlt />
                                            </IconContext.Provider>
                                        </div>
                                        <div className='flex gap-1.5 pt-0.5'>
                                            <p className="text-lg">Delete board</p>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            ))}
        </>
    );
}
