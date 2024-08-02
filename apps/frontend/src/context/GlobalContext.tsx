import React, {createContext, type ReactNode, useContext, useState} from "react";
import {RouteNames} from "@repo/common/RouteNames";

interface GlobalContextType {
    routeNames: RouteNames
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface Props {
    children?: ReactNode;
}

export const GlobalProvider: React.FC<Props> =
    ({children}) => {

        const [
            routeNames,
            setRouteNames
            //TODO this will most likely be a hook
        ] = useState<RouteNames | undefined>(new RouteNames("http://localhost:3001"))

        return routeNames ? (
            <GlobalContext.Provider value={
                {routeNames}
            }>
                {children}
            </GlobalContext.Provider>
        ) : <h1>Loading</h1> //TODO some nice spinning gif?
    };

export const useGlobalContext = (): GlobalContextType => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error('useGlobalContext must be used within an AuthProvider');
    }
    return context;
};
