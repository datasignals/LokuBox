import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Login from './Components/Login';
import Profile from './Components/Profile';
import Home from './Components/Home';
import Shared from './Components/Shared';
import Team from './Components/Team';
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<Home />} />
        <Route path="/Shared" element={<Shared />} />
        <Route path="/Team" element={<Team />} />
      </Routes>
    </Router>
  );
};

export default App;