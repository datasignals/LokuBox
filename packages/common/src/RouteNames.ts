import axios, { type AxiosResponse } from "axios";
import {type DataResponse, type SimpleResponse} from "./SimpleResponse";

type Method = "POST" | "GET" | "DELETE";

interface DataRouteName<T extends object, V> {
    method: Method;
    route: string;
    fun: (params: T) => string,
    fun2: (params: T) => Promise<DataResponse<V>>
}

interface SimpleRouteName<T extends object> {
    method: Method;
    route: string;
    fun: (params: T) => string,
    fun2: (params: T) => Promise<SimpleResponse>
}

export const PP = {
    method: "GET",
    route: "/api/v1/root",

    fun: (path: string) => encodeURI(``),

    fun2: async (path: string): Promise<DataResponse<string[]>> => {
        try {
            const response: AxiosResponse<DataResponse<string[]>> = await axios.get<DataResponse<string[]>>(
                `http://localhost:3001`
            );
            return response.data;
        } catch (error: unknown) {
            return {
                isSuccessful: false,
                message: "failed"
            } as DataResponse<string[]>;
        }
    }
}

export const getNode: DataRouteName<{
    path?: string
}, string[]> = {
    method: "GET",
    route: "/api/v1/root",

    fun: ({path}) => encodeURI(`${getNode.route}/${path ? path : ""}`),

    fun2: async ({ path }): Promise<DataResponse<string[]>> => {
        try {
            const response: AxiosResponse<DataResponse<string[]>> = await axios.get<DataResponse<string[]>>(
                `http://localhost:3001${getNode.fun({ path })}`
            );
            return response.data;
        } catch (error: unknown) {
            return {
                isSuccessful: false,
                message: "failed"
            } as DataResponse<string[]>;
        }
    }
}

export const deleteNode: SimpleRouteName<{
    path: string
}> = {
    method: "DELETE",
    route: "/api/v1/root",

    fun: ({path}) => encodeURI(`${deleteNode.route}/${path}`),

    fun2: async ({path}): Promise<DataResponse<string>> => {
        try {
            const response = await axios
                .get<DataResponse<string>>(`http://localhost:3001${deleteNode.fun({path})}`);
            return response.data;
        } catch (_e) {
            return ({isSuccessful: false, message: "failed"} as DataResponse<string>);
        }
    }
}

export const putNode: SimpleRouteName<{
    path: string,
    contents?: Buffer | string
}> = {
    method: "POST",
    route: "/api/v1/root",

    fun: ({path}) => encodeURI(`${putNode.route}/${path}`),

    fun2: async ({path}): Promise<DataResponse<string>> => {
        try {
            const response = await axios
                .get<DataResponse<string>>(`http://localhost:3001${putNode.fun({path})}`);
            return response.data;
        } catch (_e) {
            return ({isSuccessful: false, message: "failed"} as DataResponse<string>);
        }
    }
};


