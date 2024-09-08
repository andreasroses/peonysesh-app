import { useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Task } from '../db';
import { CiCirclePlus } from 'react-icons/ci';
import { IconContext } from 'react-icons';
import useSound from 'use-sound';

interface LoadTasksProps {
    board_ID: number
}
export function LoadTasks({ board_ID }: LoadTasksProps) {
    const tasks = useLiveQuery(() => db.tasks.where('boardID').equals(board_ID).toArray(), [board_ID]);
    const [editableTaskId, setEditableTaskId] = useState<number | null>(null);
    const [inputValue, setInputValue] = useState<string>('');
    const [isAdding, setIsAdding] = useState(false);
    const [playTaskOver] = useSound('./sounds/task-done.mp3', { volume: 0.75 });
    useEffect(() => {
        if (isAdding && tasks && tasks.length > 0) {
            const newTask = tasks[tasks.length - 1];
            setEditableTaskId(newTask.id);
            setInputValue(newTask.title);
            setIsAdding(false);
        }
    }, [isAdding, tasks, setIsAdding]);

    const taskOver = useCallback(() => {
        playTaskOver();
    }, [playTaskOver]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };
    const handleBlur = async (id: number) => {
        await db.tasks.update(id, { title: inputValue });
        setEditableTaskId(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: number) => {
        if (e.key === 'Enter') {
            e.currentTarget.blur();
        }
    };
    const addNewTask = async () => {
        const newTask: Omit<Task, 'id'> = { title: '', boardID: board_ID }; // Omit the id since it's auto-generated
        await db.tasks.add(newTask);
        setIsAdding(true);
    };

    const checkedBox = async (task_id: number) => {
        await db.tasks.delete(task_id);
        taskOver();
    }
    return (
        <>
            {tasks?.map((task) => (
                <div className="card card-compact bg-base-200 mb-5 w-80" key={task.id}>
                    <div className="flex items-center justify-between px-4 py-2">
                        {editableTaskId === task.id ? (
                            <input
                                type="text"
                                value={inputValue}
                                onChange={handleNameChange}
                                onBlur={() => handleBlur(task.id)}
                                onKeyDown={(e) => handleKeyDown(e, task.id)}
                                autoFocus
                                className="flex-grow mr-2"
                            />
                        ) : (
                            <h2 className="font-semibold m-1 flex-grow text-lg" onClick={() => {
                                setEditableTaskId(task.id);
                                setInputValue(task.title);
                            }}>
                                {task.title || 'New task'}
                            </h2>
                        )}
                        <input type="checkbox" className="checkbox" onClick={() => { checkedBox(task.id) }} />
                    </div>
                </div>
            ))}
            <button className="btn btn-sm btn-neutral mt-4" onClick={addNewTask}>
                <div className='flex flex-initial items-center gap-1.5'>
                    <div className='pb-0.5'>
                    <IconContext.Provider value={{ size: '23', style: { verticalAlign: '20px' } }}>
                        <CiCirclePlus />
                    </IconContext.Provider>
                    </div>
                    <div className='flex gap-1.5 pt-0.5'>
                        <p className="text-lg">Add new task</p>
                    </div>
                </div>
            </button>
        </>
    );
}