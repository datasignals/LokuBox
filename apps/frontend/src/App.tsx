import {type FC} from 'react';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import Home from './Components/Home';
import Login from './Components/Login';
import Profile from './Components/Profile';
import {TreeView} from "./Components/treeview/TreeView";
import {DirectoryElement} from "./Components/treeview/DirectoryElement";

export const App: FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/login" element={<Home/>}/>
                {/*TODO example of File Browser*/}
                {/*<Route path="/tree" element={<TreeView/>}/>*/}
                <Route path="/tree" element={<DirectoryElement name=""/>}/>
            </Routes>
        </Router>
    );
};