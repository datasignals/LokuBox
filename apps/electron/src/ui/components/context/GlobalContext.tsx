import { SimpleResponse } from "@repo/common/dist/SimpleResponse";
import React, { createContext, type ReactNode, useContext, useEffect, useState } from "react";

interface GlobalContextType {
  provenanceAddress: string;
  nfsPath: string;
  selectedPath: string;
  setSelectedPath: (path: string) => void;
  setNfsPath: (path: string) => void;
  nfsAddress: string;
  isNfsMounted: boolean;
  askMountOnce: boolean;
  setAskMountOnce: (_: boolean) => void;
  mountNfs: () => Promise<SimpleResponse>;
  unmountNfs: () => Promise<SimpleResponse>;
}

interface AppConfig {
  provenace: {
    server: string;
  };
  backendAddress: string;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface Props {
  children?: ReactNode;
}

export const GlobalProvider: React.FC<Props> = ({ children }) => {
  //TODO this should be one class inside of route names
  const [provenanceAddress, setProvenanceAddress] = useState<string | undefined>(undefined);

  //TODO should be a config option
  const [nfsPath, setNfsPath] = useState("/Users/og_pixel/nfs");
  // const [nfsPath, setNfsPath] = useState("/Volumes/user_key=shahrukh");
  const [selectedPath, _setSelectedPath] = useState(nfsPath);
  const [isNfsMounted, setIsNfsMounted] = useState<boolean | undefined>(true); //TODO not desirable approach

  const [nfsAddress, setNfsAddress] = useState("fs.lockular.in:/user_key=shahrukh");
  const [askMountOnce, setAskMountOnce] = useState(false);

  //This will prevent user from leaving mounted drive
  const setSelectedPath = (path: string) => {
    if (path.startsWith(nfsPath)) {
      _setSelectedPath(path);
    }
  };

  const mountNfs = async (): Promise<SimpleResponse> => {
    if (isNfsMounted === false) {
      const result = await electron.ipcRenderer.fs.mountNfs({ address: nfsAddress, mountPath: nfsPath });

      if (result.isSuccessful) {
        setIsNfsMounted(true);
      }

      return result;
    }
    return {
      isSuccessful: false,
      message: "Already Mounted",
    };
  };

  const unmountNfs = async (): Promise<SimpleResponse> => {
    if (isNfsMounted === true) {
      const result = await electron.ipcRenderer.fs.unmountNfs(nfsPath);

      if (result.isSuccessful) {
        setIsNfsMounted(false);
        //Don't ask if user just explicitly unmounted
        setAskMountOnce(true);
      }

      return result;
    }
    return {
      isSuccessful: false,
      message: "Already Unmounted",
    };
  };

  useEffect(() => {
    electron.ipcRenderer.fs.isNfsMounted(nfsPath).then((e) => {
      setIsNfsMounted(e.isSuccessful);
    });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        nfsPath,
        setNfsPath,
        selectedPath,
        setSelectedPath,
        askMountOnce,
        setAskMountOnce,
        nfsAddress,
        provenanceAddress,
        isNfsMounted,
        mountNfs,
        unmountNfs,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within an AuthProvider");
  }
  return context;
};
