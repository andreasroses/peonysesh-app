import { useState, useEffect, useCallback, useRef } from 'react';
import useSound from 'use-sound';

export function PomodoroTimer() {
    const [seconds, setSeconds] = useState(0);
    const [originalSec, setOriginalSec] = useState(0);
    const [originalMin, setOriginalMin] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [percentage, setPercentage] = useState(100);
    const [lastPercentage, setLastPercentage] = useState(100);
    const [tick, setTick] = useState(false)
    const [timeInput, setTimeInput] = useState('');
    const [play] = useSound('./sounds/bell-chord1.mp3',{ volume: 0.85 });

    const timeUp = useCallback(() => {
        play();
    }, [play]);
    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTimeInput(event.target.value);
    };

    
    const startTimer = () => {
        const [newMin, newSec] = validateTime();
        if(newMin === 0 && newSec === 0){
            return;
        }else{
            setTick(true);
            setMinutes(newMin);
            setSeconds(newSec);
            if(newMin !== minutes || newSec !== seconds){
                setOriginalMin(newMin);
                setOriginalSec(newSec);
            }
        }
    };

    const pauseTimer = () => {
        setTick(false);
        setTimeInput(minutes+":"+seconds);
    };

    const resetTimer = () => {
        setTick(false);
        setLastPercentage(100);
        setTimeInput(originalMin+":"+(originalSec < 10 ? '0'+originalSec : originalSec))
        setMinutes(originalMin);
        setSeconds(originalSec);
        setOriginalMin(0);
        setOriginalSec(0);
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

    const calcPercentage = () =>{
        if(tick){
            const totalSec = originalSec + (originalMin * 60);
            const currSec = seconds + (minutes * 60);
            setLastPercentage(currSec/totalSec * 100)
        }
        return lastPercentage;
    }

    useEffect(() => {
        setPercentage(calcPercentage());
    })

    useEffect(() => {
        let timer: NodeJS.Timeout | undefined;
        if (tick) {
            timer = setInterval(() => {
                setSeconds((prevSeconds) => {
                    if (prevSeconds === 0) {
                        if (minutes === 0) {
                            resetTimer();
                            timeUp();
                            return 0;
                        }
                        else {
                            setMinutes((prevMinutes) => prevMinutes - 0.5);
                            return 59;
                        }
                    }
                    return prevSeconds - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);

    }, [tick])

    return (
        <>
            <div className="radial-progress text-primary" style={{ "--value": percentage, "--size": "20rem", "--thickness": "10px" } as any} role="progressbar">
            <div className='flex flex-col'>
                    {minutes !== 0 || seconds !== 0 ? (
                        <h2 className='text-2xl font-semibold text-primary'> {minutes} : {seconds < 10 ? '0' + seconds : seconds} </h2>
                    ) : (
                        <p className='text-2xl font-semibold text-primary'>Set the timer</p>
                    )}
                </div>
            </div>
            {tick === false ? (
                <div className='flex flex-col'>
                    <input type="text" placeholder="mm:ss" className="input input-bordered max-w-20 placeholder: text-center" value = {timeInput} onChange = {handleInputChange}/>
                    <button className="btn btn-sm btn-primary justify-center mt-1.5" onClick={startTimer}>
                        <p className='text-lg'>Start</p>
                    </button>
                </div>

            ) : (
                <div className='flex flex-col'>
                    <button className="btn btn-sm btn-primary justify-center mt-4" onClick={pauseTimer}>
                        <p className='text-lg'>Pause</p>
                    </button>
                    <button className="btn btn-sm btn-primary justify-center mt-4" onClick={resetTimer}>
                        <p className='text-lg'>Stop</p>
                    </button>
                </div>
            )}

        </>
    )
}