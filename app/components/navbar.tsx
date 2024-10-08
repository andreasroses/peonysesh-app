'use client'
import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

const Navbar: React.FC = () => {
    const {changeTheme}:any = useContext(ThemeContext);
    const {theme}:any = useContext(ThemeContext);


    return (
        <div className="navbar bg-primary flex justify-between p-3">
            <div className='navbar-start'>

            </div>
            <div className='text-2xl navbar-center'>
                <h1 className="text-center text-neutral-content" id='navbar-title'>Peony Sessions</h1>
            </div>
            <div className='navbar-end'>
            <select name = "theme" defaultValue = {theme} onChange={e => changeTheme(e.target.value)} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                <option value="retro">Retro</option>
                <option value="coffee">Coffee</option>
                <option value="pastel">Pastel</option>
            </select>
            </div>
        </div>
    );
};
export default Navbar;