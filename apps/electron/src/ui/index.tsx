import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import App from 'ui/App';
import { GlobalProvider } from 'ui/components/context/GlobalContext';
import { WalletProvider } from 'ui/components/context/WalletContext';

const container = document.getElementById('root') as HTMLDivElement;
const root = createRoot(container);

console.log("hello world");
root.render(
      <App />
);
