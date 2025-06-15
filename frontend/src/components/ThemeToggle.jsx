import React from 'react';
import { Sun, Moon } from 'lucide-react';
import '../styles/toggle.css';

const ThemeToggle = ({ dark, setDark }) => {
  return (
    <button className="toggle-btn" onClick={() => setDark(!dark)}>
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

export default ThemeToggle;