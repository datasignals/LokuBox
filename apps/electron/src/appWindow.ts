import { exec } from "child_process";
import { app, BrowserWindow, Menu, session } from "electron";
import path from "path";

import { ElectronChromeExtensions } from "electron-chrome-extensions";
import windowStateKeeper from "electron-window-state";

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

  // const win = new BrowserWindow({
  //   width: 800,
  //   height: 600,
  //   webPreferences: {
  //     nodeIntegration: false,
  //     contextIsolation: true,
  //     preload: path.join(__dirname, "preload.js"),
  //   },
  // });
  // const chromePath = "/Users/Applications/Google Chrome";
  // const extensionPath = "/Users/og_pixel/Desktop/polkadot";
  //
  // win.loadURL(`https://ddg.gg`);
  // // Once the page is loaded, execute JS to interact with Polkadot.js
  // win.webContents.on("did-finish-load", () => {
  //   win.webContents
  //     .executeJavaScript(
  //       `
  //       const browser = require('puppeteer').launch({
  //           executablePath: '${chromePath}',
  //           args: ['--load-extension=${extensionPath}']
  //       });
  //
  //       browser.newPage().then(page => {
  //           page.goto('https://google.com');
  //       });
  //
  //       (async () => {
  //           console.log("hello world");
  //           const { web3Enable, web3Accounts } = window.injectedWeb3;
  //
  //           // Enable the extension
  //           const extensions = await web3Enable('Your App Name');
  //           if (extensions.length === 0) {
  //               return; // no extension found
  //           }
  //
  //           // Retrieve accounts
  //           const accounts = await web3Accounts();
  //           return accounts;
  //       })()
  //   `,
  //     )
  //     .then((accounts) => {
  //       console.log("Accounts:", accounts);
  //       // Send the accounts back to Electron or handle them in your Dapp
  //     });
  // });

  if (process.platform === "darwin") {
    windowOptions.titleBarStyle = "hidden";
  }

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
