import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Profile from './components/Profile';
import {DirectoryElement} from "./components/treeview/DirectoryElement";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/home" element={<Home />} />
          <Route path="/tree" element={<DirectoryElement name=""/>}/>
      </Routes>
    </Router>
  );
};

export default App;