import {FC} from "react";
import {DirectoryComponent} from "./DirectoryComponent";
import {DirectoryNode} from "../del/DirectoryNode";
import {FileNode} from "../del/FileNode";

// <Directory dir={new DirectoryNode({name: "root"})}/>
export const FileTree: FC = () => {
    const aaa =
        new DirectoryNode({
            name: "a",
            files: [
                new FileNode({name: "a", type: "txt", contents: "hello world1"}),
                new FileNode({name: "b", type: "txt", contents: "hello world2"}),
            ],
            directories: [
                new DirectoryNode({
                    name: "dir1", files: [
                        new FileNode({name: "dir1-a", type: "txt", contents: "hello world-dir1-1"}),
                        new FileNode({name: "dir1-b", type: "txt", contents: "hello world-dir1-2"}),
                    ]
                }),
                new DirectoryNode({
                    name: "dir2", files: [
                        new FileNode({name: "dir2-a", type: "txt", contents: "hello world-dir2-1"}),
                    ]
                })
            ]
        })

    console.log(JSON.stringify(aaa, null, 2));

    return (
        <DirectoryComponent dir={
            aaa
        }/>
    )
}