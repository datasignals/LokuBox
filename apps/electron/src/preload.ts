import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

import { FileDescription } from "@repo/common/dist/Models";
import { SimpleResponse } from "@repo/common/dist/SimpleResponse";

const versions: Record<string, unknown> = {};

// Process versions
for (const type of ["chrome", "node", "electron"]) {
  versions[type] = process.versions[type];
}

function validateIPC(channel: string) {
  if (!channel) {
    throw new Error(`Unsupported event IPC channel '${channel}'`);
  }

  return true;
}

export type RendererListener = (event: IpcRendererEvent, ...args: any[]) => void;

export const globals = {
  /** Processes versions **/
  versions,

  /**
   * A minimal set of methods exposed from Electron's `ipcRenderer`
   * to support communication to main process.
   */
  ipcRenderer: {
    fs: {
      readDir: (dirPath: string): Promise<{ files: FileDescription[]; directories: string[] }> =>
        ipcRenderer.invoke("read-dir", dirPath),
      readFile: (filePath: string): Promise<SimpleResponse> => ipcRenderer.invoke("read-file", filePath),
      createDir: (dirPath: string): Promise<SimpleResponse> => ipcRenderer.invoke("create-dir", dirPath),
      createFile: (filePath: string, buffer: ArrayBuffer): Promise<SimpleResponse> =>
        ipcRenderer.invoke("create-file", filePath, buffer),
      deleteDirOrFile: (path: string): Promise<SimpleResponse> => ipcRenderer.invoke("remove-dir-file", path),
      mountNfs: (config: { address: string; mountPath: string }): Promise<SimpleResponse> =>
        ipcRenderer.invoke("mount-nfs", config.address, config.mountPath),
      unmountNfs: (mountPath: string): Promise<SimpleResponse> => ipcRenderer.invoke("unmount-nfs", mountPath),
      isNfsMounted: (mountPath: string): Promise<SimpleResponse> => ipcRenderer.invoke("is-nfs-mounted", mountPath),
      test: (): Promise<string> => ipcRenderer.invoke("hello-world", "mount path"),
    },

    send(channel: string, ...args: any[]) {
      if (validateIPC(channel)) {
        ipcRenderer.send(channel, ...args);
      }
    },

    invoke(channel: string, ...args: any[]) {
      if (validateIPC(channel)) {
        return ipcRenderer.invoke(channel, ...args);
      }
    },

    on(channel: string, listener: RendererListener) {
      if (validateIPC(channel)) {
        ipcRenderer.on(channel, listener);

        return this;
      }
    },

    once(channel: string, listener: RendererListener) {
      if (validateIPC(channel)) {
        ipcRenderer.once(channel, listener);

        return this;
      }
    },

    removeListener(channel: string, listener: RendererListener) {
      if (validateIPC(channel)) {
        ipcRenderer.removeListener(channel, listener);

        return this;
      }
    },
  },
};

/** Create a safe, bidirectional, synchronous bridge across isolated contexts
 *  When contextIsolation is enabled in your webPreferences, your preload scripts run in an "Isolated World".
 */
contextBridge.exposeInMainWorld("electron", globals);
