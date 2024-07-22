'use client'
import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({children}: any) => {
    const [theme, setTheme] = useState("valentine");
    const [isMounted,setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const storedTheme = localStorage.getItem("theme") || "valnetine";
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
