import { Node } from "./Node";
export declare class FileNode implements Node {
    name: string;
    contents: Buffer | string;
    type: string;
    constructor(conf: {
        name: string;
        type: string;
        contents: Buffer | string;
    });
}
//# sourceMappingURL=FileNode.d.ts.map