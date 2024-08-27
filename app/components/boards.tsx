import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Board } from '../db';
import { LoadTasks } from './tasks';
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

    return (
        <>
            {boards?.map((board) => (
                <div className="card card-normal w-96 shadow-xl bg-base" key={board.id}>
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
                            <h2 className="card-title text-2xl" onClick={() => {
                                setEditableBoardId(board.id);
                                setInputValue(board.name);
                            }}>
                                {board.name || 'New Board'}
                            </h2>
                        )}
                        <div>
                            <LoadTasks board_ID = {board.id}/>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}
