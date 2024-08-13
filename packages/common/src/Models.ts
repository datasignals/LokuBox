export interface FileToShare {
    filename: string;
    creationDate: number;
}

export interface FileDescription {
    filename: string;
    creationDate: number;
}

export interface WalletAccount {
    address: string;
}

export const getDateTime = (timestamp : number): string =>  {
    const date = new Date(timestamp);
    return date.toLocaleString();
}