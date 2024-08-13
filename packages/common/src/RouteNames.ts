import axios, {type AxiosResponse} from "axios";
import {type DataResponse, type SimpleResponse} from "./SimpleResponse";
import {FileDescription} from "./Models";

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

type NodeInfo = {
    files: FileDescription[],
    directories: string[]
} | string


export const isDirRead = (nodeInfo: NodeInfo | undefined): nodeInfo is { files: FileDescription[], directories: string[] } =>
    nodeInfo !== undefined &&
    typeof nodeInfo === 'object' &&
    'files' in nodeInfo &&
    'directories' in nodeInfo;


export const isString = (nodeInfo: NodeInfo | undefined): nodeInfo is string =>
    typeof nodeInfo === "string"


export class RouteNames {

    public backendAddress: string;

    constructor(backendAddress: string) {
        this.backendAddress = backendAddress;
    }


    public getNode: DataRouteName<{
        path?: string
    }, NodeInfo> = {
        method: "GET",
        route: "/api/v1/root",

        fun: ({path}) => encodeURI(`${this.getNode.route}/${path ? path : ""}`),

        fun2: async ({path}): Promise<DataResponse<NodeInfo>> => {
            try {
                const response: AxiosResponse<DataResponse<NodeInfo>> = await axios.get<DataResponse<NodeInfo>>(
                    `${this.backendAddress}${this.getNode.fun({path})}`
                );
                return response.data;
            } catch (error: unknown) {
                return {
                    isSuccessful: false,
                    message: "failed"
                } as DataResponse<NodeInfo>;
            }
        }
    }

    public deleteNode: SimpleRouteName<{
        path: string
    }> = {
        method: "DELETE",
        route: "/api/v1/root",

        fun: ({path}) => encodeURI(`${this.deleteNode.route}/${path}`),

        fun2: async ({path}): Promise<SimpleResponse> => {
            try {
                const response: AxiosResponse<SimpleResponse> = await axios.delete<SimpleResponse>(
                    `${this.backendAddress}${this.deleteNode.fun({path})}`
                );
                return response.data;
            } catch (error: unknown) {
                return {
                    isSuccessful: false,
                    message: "failed"
                } as SimpleResponse;
            }
        }
    }

    public putNode: SimpleRouteName<{
        path: string,
        isDirectory: boolean,
        content?: Buffer | string
    }> = {
        method: "POST",
        route: "/api/v1/root",

        //TODO small problem as with this approach I have to feed it all params
        fun: ({path}) => encodeURI(`${this.putNode.route}/${path}`),

        fun2: async ({path, isDirectory, content}): Promise<SimpleResponse> => {
            const body = {
                isDirectory,
                content
            }
            try {
                const response: AxiosResponse<SimpleResponse> = await axios.post<SimpleResponse>(
                    `${this.backendAddress}${this.putNode.fun({path, isDirectory, content})}`,
                    body,
                );
                return response.data;
            } catch (error: unknown) {
                return {
                    isSuccessful: false,
                    message: "failed"
                } as SimpleResponse;
            }
        }
    };





}
//
//
// export const getNode: DataRouteName<{
//     path?: string
// }, NodeInfo> = {
//     method: "GET",
//     route: "/api/v1/root",
//
//     fun: ({path}) => encodeURI(`${getNode.route}/${path ? path : ""}`),
//
//     fun2: async ({path}): Promise<DataResponse<NodeInfo>> => {
//         try {
//             const response: AxiosResponse<DataResponse<NodeInfo>> = await axios.get<DataResponse<NodeInfo>>(
//                 `http://localhost:3001${getNode.fun({path})}`
//             );
//             return response.data;
//         } catch (error: unknown) {
//             return {
//                 isSuccessful: false,
//                 message: "failed"
//             } as DataResponse<NodeInfo>;
//         }
//     }
// }
//
// export const deleteNode: SimpleRouteName<{
//     path: string
// }> = {
//     method: "DELETE",
//     route: "/api/v1/root",
//
//     fun: ({path}) => encodeURI(`${deleteNode.route}/${path}`),
//
//     fun2: async ({path}): Promise<SimpleResponse> => {
//         try {
//             const response: AxiosResponse<SimpleResponse> = await axios.delete<SimpleResponse>(
//                 `http://localhost:3001${deleteNode.fun({path})}`
//             );
//             return response.data;
//         } catch (error: unknown) {
//             return {
//                 isSuccessful: false,
//                 message: "failed"
//             } as SimpleResponse;
//         }
//     }
// }
//
// export const putNode: SimpleRouteName<{
//     path: string,
//     isDirectory: boolean,
//     content?: Buffer | string
// }> = {
//     method: "POST",
//     route: "/api/v1/root",
//
//     //TODO small problem as with this approach I have to feed it all params
//     fun: ({path}) => encodeURI(`${putNode.route}/${path}`),
//
//     fun2: async ({path, isDirectory, content}): Promise<SimpleResponse> => {
//         const body = {
//             isDirectory,
//             content
//         }
//         try {
//             const response: AxiosResponse<SimpleResponse> = await axios.post<SimpleResponse>(
//                 `http://localhost:3001${putNode.fun({path, isDirectory, content})}`,
//                 body,
//             );
//             return response.data;
//         } catch (error: unknown) {
//             return {
//                 isSuccessful: false,
//                 message: "failed"
//             } as SimpleResponse;
//         }
//     }
// };
//
//
