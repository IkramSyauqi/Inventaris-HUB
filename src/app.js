import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './login.js';
import Dashboard from './dashboard.js';
import DashboardUser from './dashboard-user.js';
import Home from './home.js';
import DarkModeToggle from './components/darkModeToggle.js';

function App() {
  return (
    <Router>
      <div>
        <div className='flex justify-end'>
          <DarkModeToggle />
        </div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard-user" element={<DashboardUser />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
