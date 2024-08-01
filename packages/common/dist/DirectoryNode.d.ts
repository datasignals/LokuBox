import { Node } from "./Node";
import { FileNode } from "./FileNode";
export declare class DirectoryNode implements Node {
    name: string;
    directories: Map<string, DirectoryNode>;
    files: Map<string, FileNode>;
    constructor(conf: {
        name: string;
        files?: FileNode[];
        directories?: DirectoryNode[];
    });
    addFile(file: FileNode): void;
    addDirectory(directory: DirectoryNode): void;
}
//# sourceMappingURL=DirectoryNode.d.ts.map