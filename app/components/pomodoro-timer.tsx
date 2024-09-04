import { useState, useEffect } from 'react';

export function PomodoroTimer(){
    
    return (
        <>
            <div className="radial-progress text-neutral" style={{ "--value": 70, "--size": "20rem", "--thickness": "10px"} as any} role="progressbar">
            </div>
            <input type="text" placeholder="mm:ss" className="input input-bordered max-w-20 placeholder: text-center" />
            <button className="btn btn-sm btn-primary justify-center mt-4">
                <p className='text-lg'>Start</p>
            </button>
        </>
    )
}