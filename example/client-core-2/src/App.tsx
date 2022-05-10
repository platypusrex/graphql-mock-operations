import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Users } from './routes/Users';
import './App.css';

export const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <Link to="/">Home</Link>
          </nav>
        </header>
      </div>
      <div style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<Users />} />
        </Routes>
      </div>
    </Router>
  );
};
