import {type FC, useEffect, useState} from "react";
import {FileElement} from "./FileElement";
import {DirectoryElement} from "./DirectoryElement";
import {getNode, isNodeInfoObject} from "@repo/common/RouteNames";

interface Props {
    cachedFiles?: string[],
    cachedDirectories?: string[]
}

//Starts with Root
export const TreeView: FC<Props> = ({cachedFiles, cachedDirectories}) => {

    const [files, setFiles] =
        useState<string[]>(cachedFiles ?? [])

    const [directories, setDirectories] =
        useState<string[]>(cachedDirectories ?? [])

    const [isOpen, setIsOpen] =
        useState(false);


    useEffect(() => {
        getNode.fun2({})
            .then(e => {
                const nodeInfo = e.data
                if (isNodeInfoObject(nodeInfo)) {
                    setFiles(nodeInfo.files)
                    setDirectories(nodeInfo.directories)
                }
            })
            .catch((e: unknown) => null)
    }, []);


    //TODO TreeView and  are almost duplicates of one another, fix that
    const uploadFile = () => {

    }

    const createDir = () => {

    }




    return (
        <>
            <button type="button" onClick={() => setIsOpen(!isOpen)}>{isOpen ?
                `📂/` :
                `📁/`
            }</button>
            <button onClick={uploadFile}>☁️</button>
            <button onClick={createDir}>🗂️</button>

            <br/>
            {isOpen &&
                files.map(file =>
                    <FileElement key={`/${file}`} name={`/${file}`}/>
                )}
            {isOpen &&
                directories.map(directory =>
                    <DirectoryElement key={`/${directory}`} name={`/${directory}`}/>
                )}
        </>
    )
}


