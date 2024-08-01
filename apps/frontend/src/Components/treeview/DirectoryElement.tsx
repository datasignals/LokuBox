import {FC, useEffect, useState} from "react";
import {getNode, isNodeInfoObject} from "@repo/common/RouteNames";
import {FileElement} from "./FileElement";

interface Props {
    name: string,
    cachedFiles?: string[],
    cachedDirectories?: string[]
}

export const DirectoryElement: FC<Props> = ({name, cachedFiles, cachedDirectories}) => {

    const [files, setFiles] =
        useState<string[]>(cachedFiles ?? []);

    const [directories, setDirectories] =
        useState<string[]>(cachedDirectories ?? []);

    const [isOpen, setIsOpen] =
        useState(false);

    const displayContents = (): void => {
        getNode.fun2({path: name})
            .then(e => {
                const nodeInfo = e.data
                if (isNodeInfoObject(nodeInfo)) {
                    setFiles(nodeInfo.files)
                    setDirectories(nodeInfo.directories)
                }
                setIsOpen(!isOpen);
            })
            .catch((e: unknown) => null)
    }


    return (
        <>
            <button type="button" onClick={displayContents}>{isOpen ?
                `📂${name}`:
                `📁${name}`
            }</button>
            <br/>
            {isOpen &&
                files.map(file =>
                    <FileElement key={`${name}/${file}`} name={`${name}/${file}`}/>
                )}
            {isOpen &&
                directories.map(directory =>
                <DirectoryElement key={`${name}/${directory}`} name={`${name}/${directory}`}/>
            )}
        </>
    )
}