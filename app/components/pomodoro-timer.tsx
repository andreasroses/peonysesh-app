import { useState, useEffect, useCallback, useRef } from 'react';
import useSound from 'use-sound';

export function PomodoroTimer() {
    const workerRef = useRef<Worker | null>(null);
    
    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [timeInput, setTimeInput] = useState('25:00');
    
    const [lastPercentage, setLastPercentage] = useState(100);
    const [tick, setTick] = useState(false);
    const [paused, setPaused] = useState(false);

    const [playPomo] = useSound('./sounds/pomo-over.mp3', { volume: 0.75 });
    const [playBreak] = useSound('./sounds/break-over.mp3', { volume: 0.75 });
    
    const [pomoMode, setPomoMode] = useState(true);
    const [timerColor, setTimerColor] = useState('primary');
    
    const switchTimerMode = () => {
        resetTimer();
        setPomoMode((currPomo) => {
            if (currPomo) {
                setTimeInput("15:00");
            }
            else {
                setTimeInput("25:00");
            }
            return !currPomo;
        });
    };

    const timeUp = useCallback(() => {
        if (pomoMode) {
            playPomo();
        }
        else {
            playBreak();
        }
    }, [playPomo, playBreak, pomoMode]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTimeInput(event.target.value);
    };


    const startTimer = () => {
        const [currMin, currSec] = timeInput.split(':').map(Number);
        if(paused && currMin == minutes && currSec == seconds){
            if (workerRef.current) {
                workerRef.current.postMessage({ action: 'resume' });
                setTick(true); // Update your local state
                setPaused(false);
                return;
            }
        }
        else if(paused){
            setPaused(false);
        }
        const [newMin, newSec] = validateTime();
        if (newMin === 0 && newSec === 0) {
            return;
        }
        else {
            setTimeInput((prevInput) => {
                return newMin + ":" + (newSec < 10 ? '0' + newSec : newSec);
            });
            const duration = (newMin * 60 + newSec);  // Total duration in ms

            if (workerRef.current) {
                workerRef.current.terminate(); // Clean up any existing worker
            }

            const worker = new Worker(new URL('../timerworker.js', import.meta.url));
            workerRef.current = worker;

            worker.postMessage({ action: 'start', duration });
            setMinutes(newMin)
            setSeconds(newSec)
            worker.onmessage = (e) => {
                if (e.data.done) {
                    resetTimer();
                    timeUp();
                } else if (e.data.remainingTime !== undefined) {
                    const remainingSeconds = e.data.remainingTime;
                    setMinutes(Math.floor(remainingSeconds / 60));
                    setSeconds(remainingSeconds % 60);
                    calcPercentage(remainingSeconds, duration);
                }
                else if(e.data.reset){
                    setMinutes(0);
                    setSeconds(0);
                    return;
                }
            };

            setTick(true);
        }

    };

    const pauseTimer = () => {
        if (workerRef.current) {
            workerRef.current.postMessage({ action: 'pause' });
            setTick(false);
            setPaused(true);
            setTimeInput(minutes + ":" + (seconds < 10 ? '0' + seconds : seconds));
        }
        
    };

    const resetTimer = () => {
        if (workerRef.current) {
            workerRef.current.postMessage({ action: 'reset' });
            setPaused(false);
            setTick(false);
            setLastPercentage(100);
        }
    };

    const validateTime = () => {
        const [inputMinutes, inputSeconds] = timeInput.split(':').map(Number);
        if (
            !isNaN(inputMinutes) &&
            !isNaN(inputSeconds) &&
            inputMinutes >= 0 &&
            inputSeconds >= 0 &&
            inputSeconds < 60
        ) {
            return [inputMinutes, inputSeconds];
        }
        return [0, 0];
    }

    const calcPercentage = useCallback((remainingTime: number, totalSec: number) => {
        if (totalSec === 0) {
            return 100;
        }
        const percentage = (remainingTime / totalSec) * 100;
        setLastPercentage(percentage);
        return percentage;
    }, []);

    useEffect(() => {
        setTimerColor((currColor) => {
            if (pomoMode) {
                return "primary";
            }
            return "accent"
        });
    },[pomoMode])

    useEffect(() => {
        return () => {
            if (workerRef.current) {
                workerRef.current.terminate(); // Terminate the worker on unmount
            }
        };
    }, []);


    return (
        <>
            <div className={`radial-progress text-${timerColor}`} style={{ "--value": lastPercentage, "--size": "20rem", "--thickness": "10px" } as any} role="progressbar">
                <div className='flex flex-col'>
                    {minutes !== 0 || seconds !== 0 ? (
                        <h2 className={`text-2xl font-semibold text-${timerColor}`}> {minutes} : {seconds < 10 ? '0' + seconds : seconds} </h2>
                    ) : (
                        pomoMode ? (
                            <p className={`text-2xl font-semibold text-${timerColor}`}>Set timer for work session</p>)
                            : (
                                <p className={`text-2xl font-semibold text-${timerColor}`}>Set timer for break</p>
                            )
                    )
                    }
                </div>
            </div>
            {tick === false ? (
                <div className='flex flex-col'>
                    <label className="swap swap-flip text-3xl mt-1.5">
                        {/* this hidden checkbox controls the state */}
                        <input type="checkbox" defaultChecked = {pomoMode} onClick={switchTimerMode} />

                        <div className="swap-on">📝</div>
                        <div className="swap-off">🤪</div>
                    </label>
                    <input type="text" placeholder="mm:ss" className="input input-bordered max-w-20 placeholder: text-center" value={timeInput} onChange={handleInputChange} />
                    <button className={`btn btn-sm btn-${timerColor} justify-center mt-1.5`} onClick={startTimer}>
                        <p className={`text-lg py-0.5`}>Start</p>
                    </button>

                </div>

            ) : (
                <div className='flex flex-col'>
                    <button className={`btn btn-sm btn-${timerColor} justify-center mt-4`} onClick={pauseTimer}>
                        <p className='text-lg py-0.5'>Pause</p>
                    </button>
                    <button className={`btn btn-sm btn-${timerColor} justify-center mt-4`} onClick={resetTimer}>
                        <p className='text-lg py-0.5'>Stop</p>
                    </button>
                </div>
            )}

        </>
    )
}