import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {App} from './App';
import './index.css';
import {reportWebVitals} from './reportWebVitals';

const root = document.getElementById("root");

if(root) {
    createRoot(root).render(
        <StrictMode>
            <App/>
        </StrictMode>,
    );
} else {
    process.exit(1);
}

reportWebVitals();