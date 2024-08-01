import { type DataResponse, type SimpleResponse } from "./SimpleResponse";
type Method = "POST" | "GET" | "DELETE";
interface DataRouteName<T extends object, V> {
    method: Method;
    route: string;
    fun: (params: T) => string;
    fun2: (params: T) => Promise<DataResponse<V>>;
}
interface SimpleRouteName<T extends object> {
    method: Method;
    route: string;
    fun: (params: T) => string;
    fun2: (params: T) => Promise<SimpleResponse>;
}
export declare const PP: {
    method: string;
    route: string;
    fun: (path: string) => string;
    fun2: (path: string) => Promise<DataResponse<string[]>>;
};
export declare const getNode: DataRouteName<{
    path?: string;
}, string[]>;
export declare const deleteNode: SimpleRouteName<{
    path: string;
}>;
export declare const putNode: SimpleRouteName<{
    path: string;
    contents?: Buffer | string;
}>;
export {};
//# sourceMappingURL=RouteNames.d.ts.map