import { BrowserWindow, ipcMain, Menu, shell } from "electron";
import * as fs from "node:fs";
import path from "node:path";

import { filterEventsSome } from "@polkadot/types/metadata/decorate";
import { FileDescription } from "@repo/common/dist/Models";

import { MenuChannels } from "src/channels/menuChannels";

export const registerMenuIpc = (mainWindow: BrowserWindow) => {
  ipcMain.on(MenuChannels.EXECUTE_MENU_ITEM_BY_ID, (event, id) => {
    const currentMenu = Menu.getApplicationMenu();

    if (currentMenu === null) {
      return;
    }

    const menuItem = currentMenu.getMenuItemById(id);
    if (menuItem) {
      const window = BrowserWindow.fromWebContents(event.sender) || undefined;
      menuItem.click(null, window, event.sender);
    }
  });

  ipcMain.on(MenuChannels.SHOW_CONTEXT_MENU, (event, template) => {
    const menu = Menu.buildFromTemplate(template);
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) {
      menu.popup({ window });
    }
  });

  ipcMain.handle(MenuChannels.WINDOW_MINIMIZE, () => {
    mainWindow.minimize();
  });

  ipcMain.handle(MenuChannels.WINDOW_MAXIMIZE, () => {
    mainWindow.maximize();
  });

  ipcMain.handle(MenuChannels.WINDOW_TOGGLE_MAXIMIZE, () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.handle(MenuChannels.WINDOW_CLOSE, () => {
    mainWindow.close();
  });

  ipcMain.handle(MenuChannels.WEB_TOGGLE_DEVTOOLS, () => {
    mainWindow.webContents.toggleDevTools();
  });

  ipcMain.handle(MenuChannels.WEB_ACTUAL_SIZE, () => {
    mainWindow.webContents.setZoomLevel(0);
  });

  ipcMain.handle(MenuChannels.WEB_ZOOM_IN, () => {
    mainWindow.webContents.setZoomLevel(mainWindow.webContents.zoomLevel + 0.5);
  });

  ipcMain.handle(MenuChannels.WEB_ZOOM_OUT, () => {
    mainWindow.webContents.setZoomLevel(mainWindow.webContents.zoomLevel - 0.5);
  });

  ipcMain.handle(MenuChannels.WEB_TOGGLE_FULLSCREEN, () => {
    mainWindow.setFullScreen(!mainWindow.fullScreen);
  });

  ipcMain.handle(MenuChannels.OPEN_GITHUB_PROFILE, (_event, id) => {
    shell.openExternal(`https://github.com/${id}`);
  });

  //FS Handling
  ipcMain.handle(
    MenuChannels.READ_DIR,
    (_event: Electron.IpcMainInvokeEvent, dirPath: string): { files: FileDescription[]; directories: string[] } => {
      const statResult = fs.statSync(dirPath);

      if (statResult.isDirectory()) {
        const contents = fs.readdirSync(dirPath);

        const files: FileDescription[] = [];
        const directories: string[] = [];

        contents.forEach((node) => {
          const nodeFullPath = path.join(dirPath, node);
          const stats = fs.lstatSync(nodeFullPath);

          if (stats.isFile()) {
            files.push({ filename: node, creationDate: stats.birthtime.getTime() });
          } else if (stats.isDirectory()) {
            directories.push(node);
          }
        });

        return {
          files,
          directories,
        };
      }

      return { files: [], directories: [] };
    },
  );
  ipcMain.handle(
    MenuChannels.READ_FILE,
    (_event: Electron.IpcMainInvokeEvent, filePath: string): string | undefined => {
      const statResult = fs.statSync(filePath);
      if (statResult.isFile()) {
        const contents: Buffer = fs.readFileSync(filePath);
        return contents.toString("base64");
      }

      return undefined;
    },
  );

  ipcMain.handle(MenuChannels.CREATE_DIR, (_event: Electron.IpcMainInvokeEvent, dirPath: string) => {
    try {
      if (fs.existsSync(dirPath)) {
        return {
          isSuccessful: false,
          message: "Directory/File already exists in this path",
        };
      }

      fs.mkdirSync(dirPath, { recursive: true });
      return {
        isSuccessful: true,
        message: "Directory Created",
      };
    } catch (e: unknown) {
      return {
        isSuccessful: false,
        message: "Failed to create file or directory",
      };
    }
  });
  ipcMain.handle(
    MenuChannels.CREATE_FILE,
    (_event: Electron.IpcMainInvokeEvent, filePath: string, fileContent: string) => {
      try {
        if (fs.existsSync(filePath)) {
          return {
            isSuccessful: false,
            message: "File already exists in this path",
          };
        }

        fs.writeFileSync(filePath, fileContent);
        return {
          isSuccessful: true,
          message: "File Created",
        };
      } catch (e: unknown) {
        return {
          isSuccessful: false,
          message: "Failed to create file or directory",
        };
      }
    },
  );

  ipcMain.handle(MenuChannels.REMOVE_DIR_FILE, (_event: Electron.IpcMainInvokeEvent, path: string) => {
    try {
      const statResult = fs.statSync(path);
      const isDir = statResult.isDirectory();

      fs.rmSync(path, { recursive: true, force: true });

      return {
        isSuccessful: true,
        message: isDir ? "Directory Removed" : "File Removed",
      };
    } catch (e: unknown) {
      return {
        isSuccessful: false,
        message: "Not a File or Dir",
      };
    }
  });
};
