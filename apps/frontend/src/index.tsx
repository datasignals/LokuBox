import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {App} from './App';
import './index.css';
import {reportWebVitals} from './reportWebVitals';
import {AuthProvider} from "./context/AuthContext";

const root = document.getElementById("root");

if(root) {
    createRoot(root).render(
        <StrictMode>
            <AuthProvider>
                <App/>
            </AuthProvider>
        </StrictMode>,
    );
} else {
    process.exit(1);
}

reportWebVitals();