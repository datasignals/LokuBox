import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { MenuChannels } from 'src/channels/menuChannels';
import { useRendererListener, useThemeListener } from 'src/ui/hooks';
import { GlobalProvider } from 'ui/components/context/GlobalContext';
import { WalletProvider } from 'ui/components/context/WalletContext';
import { Home } from 'ui/components/Home';
import { Login } from 'ui/components/Login';
import Menu from 'ui/components/Menu';
import Titlebar from 'ui/components/Titlebar';
import WindowControls from 'ui/components/WindowControls';

const onMenuEvent = (_: Electron.IpcRendererEvent, channel: string, ...args: any[]) => {
  electron.ipcRenderer.invoke(channel, args);
};

export default function App() {
  useRendererListener(MenuChannels.MENU_EVENT, onMenuEvent);

  useThemeListener();

  return (
    <WalletProvider>
      <GlobalProvider>
        <Router>
          <Titlebar>
            {(windowState) => (
              <>
                {__WIN32__ && (
                  <>
                    <Menu />
                    <WindowControls windowState={windowState} />
                  </>
                )}
              </>
            )}
          </Titlebar>
          <Routes>
            <Route path='/' element={<Home routePath='/home' />} />
            {/*<Route path='/profile' element={<Profile />} />*/}
            <Route path='/home/*' element={<Home routePath='/home' />} />
            {/*<Route path='/shared' element={<Shared />} />*/}
            {/*<Route path='/team' element={<Team />} />*/}
          </Routes>
        </Router>
      </GlobalProvider>
    </WalletProvider>
  );
}
