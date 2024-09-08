'use client';
import { useState } from 'react';
import { CiCirclePlus } from 'react-icons/ci';
import { IconContext } from 'react-icons';
import { LoadBoards } from './components/boards';
import { db, Board } from './db';
import { PomodoroTimer } from './components/pomodoro-timer';

export default function Home() {
  const [isAdding, setIsAdding] = useState(false);

  const addNewBoard = async () => {
    const newBoard: Omit<Board, 'id'> = { name: '' }; // Omit the id since it's auto-generated
    await db.boards.add(newBoard);
    setIsAdding(true);
  };

  return (
    <main>
      <div className="flex columns-2 gap-2 mx-10 space-x-20 justify-center">
        <div className=' grid grid-cols-2 grid-rows-auto gap-2 space-y-3'>
          <LoadBoards isAdding={isAdding} setIsAdding={setIsAdding} />
          <button className="btn btn-secondary flex" onClick={addNewBoard}>
            <IconContext.Provider value={{ size: '30' }}>
              <CiCirclePlus />
            </IconContext.Provider>
            <p className="text-xl">Add new board</p>
          </button>
        </div>
        <div className='py-5 flex flex-col flex-grow items-center space-y-2'>
          <h1 className='text-4xl font-bold'>Timer</h1>
          <PomodoroTimer/>
        </div>
      </div>
    </main>
  );
}