import { useState, useEffect } from 'react';

export function PomodoroTimer(){
    
    return (
        <>
            <div className="radial-progress text-neutral" style={{ "--value": 70, "--size": "20rem", "--thickness": "10px"} as any} role="progressbar">
            </div>
            <button className="btn btn-sm btn-primary justify-center mt-4">
                <p className='text-lg'>Start</p>
            </button>
        </>
    )
}