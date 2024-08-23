import React, { useEffect, useState } from "react";
import { HashRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { MenuChannels } from "src/channels/menuChannels";
import { useRendererListener, useThemeListener } from "src/ui/hooks";
import { GlobalProvider } from "ui/components/context/GlobalContext";
import { WalletProvider } from "ui/components/context/WalletContext";
import { Home } from "ui/components/Home";
import { Login } from "ui/components/Login";
import Menu from "ui/components/Menu";
import { Profile } from "ui/components/Profile";
import { Shared } from "ui/components/Shared";
import { Team } from "ui/components/Team";
import Titlebar from "ui/components/Titlebar";
import WindowControls from "ui/components/WindowControls";
import { RemoveTrailingSlashes } from "ui/components/RemoveTrailingSlashes";

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
            <Route path='/' element={<Login />} />
            <Route path='/profile' element={<Profile />} />
            <Route
              path='/home/*'
              element={
                <RemoveTrailingSlashes>
                  <Home routePath='/home' />
                </RemoveTrailingSlashes>
              }
            />
            <Route path='/shared' element={<Shared />} />
            <Route path='/team' element={<Team />} />
          </Routes>
        </Router>
      </GlobalProvider>
    </WalletProvider>
  );
}
