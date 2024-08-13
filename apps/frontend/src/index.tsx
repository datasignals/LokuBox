import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {App} from './App';
import './index.css';
import {reportWebVitals} from './reportWebVitals';
import {WalletProvider} from './context/WalletContext';
import {GlobalProvider} from "./context/GlobalContext";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);


root.render(
    // <React.StrictMode>
        <GlobalProvider>
            <WalletProvider>
                <App/>
            </WalletProvider>
        </GlobalProvider>
    // </React.StrictMode>
);

reportWebVitals();