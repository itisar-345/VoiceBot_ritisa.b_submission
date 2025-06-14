
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import '../styles/toggle.css';

const ThemeToggle = ({ dark, setDark }) => {
  return (
    <button className="toggle-btn" onClick={() => setDark(!dark)}>
      {dark ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  );
};

export default ThemeToggle;