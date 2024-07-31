import React, {StrictMode} from 'react';
import {createRoot} from "react-dom/client";
import {App} from "./App";
import {App2} from "./App2";

const root = document.getElementById("wrapper");

if(root) {
    createRoot(root).render(
        <StrictMode>
            <App2/>
        </StrictMode>
    );
} else {
    process.exit(1);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
