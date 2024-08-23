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
    const fetchConfig = async (): Promise<void> => {
      const config: AxiosResponse<AppConfig> = await axios.get("/config.json");
      // setRouteNames(new RouteNames(
      //     config.data.backendAddress,
      // ));
      // setProvenanceAddress(config.data.provenace.server);
    };

    void fetchConfig();
  }, []);

  //TODO should be a config option
  const [nfsPath, setNfsPath] = useState("/tmp/nfs");

  return <GlobalContext.Provider value={{ nfsPath, setNfsPath, provenanceAddress }}>{children}</GlobalContext.Provider>;
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
