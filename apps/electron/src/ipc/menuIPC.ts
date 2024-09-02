import { exec } from "child_process";
import { BrowserWindow, ipcMain, Menu, shell, dialog } from "electron";
import * as fs from "node:fs";
import path from "node:path";

import { filterEventsSome } from "@polkadot/types/metadata/decorate";
import { FileDescription } from "@repo/common/dist/Models";
import { SimpleResponse } from "@repo/common/dist/SimpleResponse";
import { toast } from "react-toastify";

import { MenuChannels } from "src/channels/menuChannels";

import success = toast.success;

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
    async (_event: Electron.IpcMainInvokeEvent, filePath: string): Promise<SimpleResponse> => {
      const statResult = fs.statSync(filePath);
      if (statResult.isFile()) {
        const { canceled, filePath: savePath } = await dialog.showSaveDialog(mainWindow, {
          defaultPath: filePath,
        });

        if (canceled || !savePath) {
          return {
            isSuccessful: false,
            message: "Save location choice cancelled",
          };
        }

        // Copy the file to the selected path
        fs.copyFileSync(filePath, savePath);
        return {
          isSuccessful: true,
          message: "File downloaded successfully to: " + savePath,
        };
      }

      return {
        isSuccessful: false,
        message: "Not a file to download",
      };
    },
  );

  ipcMain.handle(MenuChannels.CREATE_DIR, (_event: Electron.IpcMainInvokeEvent, dirPath: string): SimpleResponse => {
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
    (_event: Electron.IpcMainInvokeEvent, filePath: string, fileContent: ArrayBuffer): SimpleResponse => {
      try {
        if (fs.existsSync(filePath)) {
          return {
            isSuccessful: false,
            message: "File already exists in this path",
          };
        }

        fs.writeFileSync(filePath, Buffer.from(fileContent));
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

  ipcMain.handle(MenuChannels.REMOVE_DIR_FILE, (_event: Electron.IpcMainInvokeEvent, path: string): SimpleResponse => {
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

  ipcMain.handle(
    MenuChannels.MOUNT_NFS,
    async (_event: Electron.IpcMainInvokeEvent, address: string, mountPath: string): Promise<SimpleResponse> => {
      // fs.lockular.in:/user_key=shahrukh
      // /Users/og_pixel/nfs

      const command = `osascript -e 'do shell script "sudo mount_nfs -o nolocks,vers=3,tcp,rsize=131072,actimeo=120,port=2049,mountport=2049 ${address} ${mountPath}" with administrator privileges'`;
      // const command2 = `osascript -e 'tell application "Finder" to open location "nfs://fs.lockular.in:/:/user_key=shahrukh"'`;

      return execPromise(command)
        .then(() => {
          return {
            isSuccessful: true,
            message: "Mounted Successfully",
          };
        })
        .catch((error: unknown) => {
          return {
            isSuccessful: false,
            message: `Mounted Unsuccessfully: ${error.toString()}`,
          };
        });
    },
  );

  ipcMain.handle(
    MenuChannels.UNMOUNT_NFS,
    async (_event: Electron.IpcMainInvokeEvent, mountPath: string): Promise<SimpleResponse> => {
      console.log("Unmount nfs");
      const command = `osascript -e 'do shell script "sudo umount -f ${mountPath}" with administrator privileges'`;
      // const command2 = `osascript -e 'do shell script "sudo umount -f /Volumes/user_key=shahrukh" with administrator privileges'`;

      try {
        const result = await execPromise(command);
        //TODO change it will break, i don't check if it worked (unless it caught an error)
        return {
          isSuccessful: true,
          message: "Unmount Successful",
        };
        // return result.includes(mountPath)
        //   ? {
        //       isSuccessful: true,
        //       message: "Unmount Successful",
        //     }
        //   : {
        //       isSuccessful: false,
        //       message: "Nothing to Unmount",
        //     };
      } catch (error) {
        return {
          isSuccessful: false,
          message: error.toString(),
        };
      }
    },
  );

  ipcMain.handle(
    MenuChannels.IS_NFS_MOUNTED,
    async (_event: Electron.IpcMainInvokeEvent, mountPath: string): Promise<SimpleResponse> => {
      return {
        isSuccessful: true,
        message: "Already Mounted",
      };
      //TODO disabled for a test
      try {
        const result = await execPromise("mount");
        // return result.includes("/Volumes/user_key=shahrukh")
        return result.includes(mountPath)
          ? {
              isSuccessful: true,
              message: "Already Mounted",
            }
          : {
              isSuccessful: false,
              message: "Not Mounted",
            };
      } catch (error) {
        return {
          isSuccessful: false,
          message: error.toString(),
        };
      }
    },
  );

  ipcMain.handle(
    MenuChannels.SHARE_FILE,
    async (
      _event: Electron.IpcMainInvokeEvent,
      filePath: string,
      personToShareWith: string,
    ): Promise<SimpleResponse> => {
      try {
        //TODO this is not finished but that's the outline of the function
        const result = await execPromise(`ln -s ${filePath} /${personToShareWith}`);
        console.log("just trying to ln -s: ---- " + result);

        return {
          isSuccessful: true,
          message: "",
        };
      } catch (error) {
        return {
          isSuccessful: false,
          message: error.toString(),
        };
      }
    },
  );
};

const execPromise = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(`execing error ${error.message}`);
        reject(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log("execing stderr");
        reject(`Stderr: ${stderr}`);
        return;
      }
      resolve(stdout);
    });
  });
};
