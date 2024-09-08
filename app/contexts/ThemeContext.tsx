'use client'
import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext:any = createContext<typeof ThemeContext>({} as typeof ThemeContext)

export const ThemeProvider = ({children}: any) => {
    const [theme, setTheme] = useState('retro');
    const [isMounted,setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const storedTheme = localStorage.getItem("theme") || "retro";
        setTheme(storedTheme);
    },[]);
    
    if(!isMounted){
        return <>Loading...</>
    }
    const changeTheme = (theme:string) =>{
        setTheme(theme);
        localStorage.setItem("theme", theme);
    };
    
    return(
        <ThemeContext.Provider value = {{theme, changeTheme}}>
        {children}
        </ThemeContext.Provider>
    );
};
