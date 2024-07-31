import {Node} from "./Node";
import {FileNode} from "./FileNode";

export class DirectoryNode implements Node {
    name: string;
    public directories: Map<string, DirectoryNode>; //= new Map();
    public files: Map<string, FileNode>; //= new Map();

    constructor(conf: {
        name: string,
        files?: FileNode[],
        directories?: DirectoryNode[]
    }) {
        this.name = conf.name;
        this.files = new Map()
        this.directories = new Map()

        this.addFile = this.addFile.bind(this);
        this.addDirectory = this.addDirectory.bind(this);

        conf.files?.forEach(this.addFile)
        conf.directories?.forEach(this.addDirectory)
    }

    public addFile(file: FileNode): void {
        if (!this.files.get(file.name)) {
            this.files.set(file.name, file)
        }
    }

    public addDirectory(directory: DirectoryNode) {
        if (!this.directories.get(directory.name)) {
            this.directories.set(directory.name, directory)
        }
    }

}