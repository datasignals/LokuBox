export interface SimpleResponse {
    isSuccessful: boolean;
    message: string;
}
export type DataResponse<T> = SimpleResponse & {
    data?: T;
};
//# sourceMappingURL=SimpleResponse.d.ts.map