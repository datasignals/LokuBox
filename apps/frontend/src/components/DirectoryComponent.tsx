import React, {FC, useState} from "react";
import {FileComponent} from "./FileComponent";
import {DirectoryNode} from "../del/DirectoryNode";
import {FileNode} from "../del/FileNode";

export const DirectoryComponent: FC<{ dir: DirectoryNode }> = ({dir}) => {

    const [files, setFiles] =
        useState<FileNode[]>([...dir.files.values()])

    const [directories, setDirectories] =
        useState<DirectoryNode[]>([...dir.directories.values()])


    return (
        <>
            <h1>
                Dir: {dir.name}
            </h1>
            {
                files.map(e =>
                    <FileComponent file={e}/>
                )
            }
            {
                directories.map(e =>
                    <DirectoryComponent dir={e}/>
                )
            }
        </>
    )
}
