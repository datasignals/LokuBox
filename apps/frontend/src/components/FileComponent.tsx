import {FC} from "react";
import {FileNode} from "../del/FileNode";

export const FileComponent: FC<{ file: FileNode }> = ({file}) => {

    return (
        <h1>
            File: {file.name}
        </h1>
    )
}