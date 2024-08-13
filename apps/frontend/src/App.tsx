import React from 'react';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import {Home} from './components/Home';
import {Login} from './components/Login';
import {Profile} from './components/Profile';
import {Shared} from "./components/Shared";
import {Team} from "./components/Team"
import {Test} from "./components/Test";

export const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/home/*" element={<Home/>}/>
                <Route path="/shared" element={<Shared />} />
                <Route path="/team" element={<Team />} />
                <Route path="/test/*" element={<Test/>} />
            </Routes>
        </Router>
    );
};