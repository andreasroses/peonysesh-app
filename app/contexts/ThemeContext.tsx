'use client'
import React, { createContext, useState, useEffect } from 'react';

interface ThemeContextType {
    theme: string;
    changeTheme: (theme: string) => void;
}
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

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
