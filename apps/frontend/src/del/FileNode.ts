import {Node} from "./Node";

export class FileNode implements Node {
    name: string;
    contents: Buffer | string
    type: string

    constructor(conf: { name: string, type: string, contents: Buffer | string }) {
        this.name = conf.name;
        this.type = conf.type;
        this.contents = conf.contents;
    }

}