import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthProvider';
import Home from './pages/Home';
import Auth from './pages/Auth';

const App = () => (
  <Router>
    <AuthProvider>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/chat" element={<Home />} />
        <Route path="/" element={<Auth />} />
      </Routes>
    </AuthProvider>
  </Router>
);

export default App;