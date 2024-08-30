import { exec } from "child_process";
import { app, BrowserWindow, Menu, protocol, session, shell } from "electron";
import http from "http";
import path from "path";

import bodyParser from "body-parser";
import Cors from "cors";
import { ElectronChromeExtensions } from "electron-chrome-extensions";
import windowStateKeeper from "electron-window-state";
import express from "express";

import { registerMenuIpc } from "src/ipc/menuIPC";
import appMenu from "src/menu/appMenu";
import { registerWindowStateChangedEvents } from "src/windowState";

let appWindow: BrowserWindow;

/**
 * Create Application Window
 * @returns { BrowserWindow } Application Window Instance
 */
export function createAppWindow(): BrowserWindow {
  const minWidth = 960;
  const minHeight = 660;

  const savedWindowState = windowStateKeeper({
    defaultWidth: minWidth,
    defaultHeight: minHeight,
    maximize: false,
  });

  const windowOptions: Electron.BrowserWindowConstructorOptions = {
    x: savedWindowState.x,
    y: savedWindowState.y,
    width: savedWindowState.width,
    height: savedWindowState.height,
    minWidth: minWidth,
    minHeight: minHeight,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    backgroundColor: "#1a1a1a",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      preload: path.join(__dirname, "preload.js"),
    },
  };

  if (process.platform === "darwin") {
    windowOptions.titleBarStyle = "hidden";
  }

  // shell.openExternal("http://localhost:3000/connect-wallet");
  // Create new window instance
  appWindow = new BrowserWindow(windowOptions);

  // Load the index.html of the app window.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    appWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    appWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Build the application menu
  const menu = Menu.buildFromTemplate(appMenu);
  Menu.setApplicationMenu(menu);

  // Show window when is ready to
  appWindow.on("ready-to-show", () => {
    appWindow.show();
  });

  // Register Inter Process Communication for main process
  registerMainIPC();

  savedWindowState.manage(appWindow);

  // Close all windows when main window is closed
  appWindow.on("close", () => {
    appWindow = null;
    app.quit();
  });

  const expressApp = express();
  expressApp.use(bodyParser.json());
  expressApp.use(Cors({ credentials: true }));
  // Endpoint to receive wallet data
  expressApp.get("/wallet-data", (req, res) => {
    const { address, name } = req.query;
    console.log("Received wallet data:", address, name);

    // Send wallet data to renderer process
    appWindow.webContents.send("wallet-connected", { address, name });

    res.send("Wallet data received");
  });

  const server = http.createServer(expressApp);

  server.listen(3001, () => {
    console.log("Server running on http://localhost:3001");
  });

  return appWindow;
}

/**
 * Register Inter Process Communication
 */
function registerMainIPC() {
  /**
   * Here you can assign IPC related codes for the application window
   * to Communicate asynchronously from the main process to renderer processes.
   */
  registerWindowStateChangedEvents(appWindow);
  registerMenuIpc(appWindow);
}
