import { SimpleResponse } from "@repo/common/dist/SimpleResponse";
import axios, { type AxiosResponse } from "axios";
import Path from "path-browserify";
import React, { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// import {RouteNames} from "@repo/common/RouteNames";

interface GlobalContextType {
  // routeNames: RouteNames;
  provenanceAddress: string;
  nfsPath: string;
  setNfsPath: (path: string) => void;
  nfsAddress: string;
  isNfsMounted: () => Promise<boolean>;
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
  // const [
  //     routeNames,
  //     setRouteNames
  //     //TODO this will most likely be a hook
  // ] = useState<RouteNames | undefined>(undefined);

  //TODO this should be one class inside of route names
  const [provenanceAddress, setProvenanceAddress] = useState<string | undefined>(undefined);

  useEffect(() => {
    // const fetchConfig = async (): Promise<void> => {
    //   const config: AxiosResponse<AppConfig> = await axios.get("/config.json");
    //   // setRouteNames(new RouteNames(
    //   //     config.data.backendAddress,
    //   // ));
    //   // setProvenanceAddress(config.data.provenace.server);
    // };
    // void fetchConfig();

    isNfsMounted().then((result) => {
      console.log("is nfs mounted? " + result);
      if (result === false) {
        console.log("calling mountNfs");
        mountNfs();
      }
    });
  }, []);

  //TODO should be a config option
  const [nfsPath, setNfsPath] = useState("/Users/og_pixel/nfs");
  const [nfsAddress, setNfsAddress] = useState("fs.lockular.in:/user_key=shahrukh");

  const isNfsMounted = (): Promise<boolean> => {
    return electron.ipcRenderer.fs
      .isNfsMounted(nfsPath)
      .then((res) => res.isSuccessful)
      .catch(() => false);
  };

  const mountNfs = (): Promise<SimpleResponse> => {
    return electron.ipcRenderer.fs.mountNfs({ address: nfsAddress, mountPath: nfsPath });
  };

  const unmountNfs = (): Promise<SimpleResponse> => {
    return electron.ipcRenderer.fs.unmountNfs(nfsPath);
    // return electron.ipcRenderer.fs.isNfsMounted(nfsPath);
  };

  return (
    <GlobalContext.Provider
      value={{ nfsPath, setNfsPath, nfsAddress, provenanceAddress, isNfsMounted, mountNfs, unmountNfs }}
    >
      {children}
    </GlobalContext.Provider>
  );
  // return /*routeNames &&*/ provenanceAddress ? (
  //   <GlobalContext.Provider value={{ /*routeNames,*/ provenanceAddress }}>{children}</GlobalContext.Provider>
  // ) : (
  //   <h1>Loading</h1>
  // ); //TODO some nice spinning gif?
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within an AuthProvider");
  }
  return context;
};
