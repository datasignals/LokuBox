import React from 'react';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import {Home} from './components/Home';
import {Login} from './components/Login';
import {Profile} from './components/Profile';
import {Shared} from "./components/Shared";
import {Team} from "./components/Team"
import {Test} from "./components/Test";
import {RemoveTrailingSlashes} from "./components/RemoveTrailingSlashes";

export const App: React.FC = () => {
    return (
        <Router>
            <RemoveTrailingSlashes>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/home/*" element={<Home routePath="/home"/>}/>
                    <Route path="/shared" element={<Shared/>}/>
                    <Route path="/team" element={<Team/>}/>
                </Routes>
            </RemoveTrailingSlashes>
        </Router>
    );
};