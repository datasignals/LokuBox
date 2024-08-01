import {type FC, useState} from "react";
import {getNode, isNodeInfoObject, putNode} from "@repo/common/RouteNames";
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

    const [isCreateNewDirOpen, setIsCreateNewDirOpen] =
        useState(false);

    const [newDirName, setNewDirName] =
        useState("");

    const [file, setFile] =
        useState<File | undefined>(undefined);

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

    const uploadFile = () => {
        if(file === undefined) {
            return;
        }

        console.log(file)
        const a = new FileReader();

        a.onload = (e) => {
            if(e.target) { //TODO extra check
                putNode.fun2({
                    path: `${name}/${file.name}`,
                    isDirectory: false,
                    content: e.target.result as string //TODO force casting
                }).then(() => setFile(undefined))
                    .catch(() => null);
            }
        }

        a.readAsText(file, "base64")
    }

    const createDir = () => {
        putNode.fun2({
            path: `${name}/${newDirName}`,
            isDirectory: true
        }).then(() => setIsCreateNewDirOpen(false))
            .catch(() => null);
    }


    return (
        <>
            <button type="button" onClick={displayContents}>{isOpen ?
                `📂${name}` :
                `📁${name}`
            }</button>


            <button onClick={() => setIsCreateNewDirOpen(!isCreateNewDirOpen)}>🗂️</button>
            {isCreateNewDirOpen ?
                <>
                    <input type="text" onChange={e => setNewDirName(e.target.value)}/>
                    <button type="button" onClick={createDir}>✅</button>
                </> :
                null
            }

            <input
                type="file"
                name="file"
                id="artifactFile"
                onChange={e =>
                    e.target.files && setFile(e.target.files[0])
                }
            />
            <button onClick={uploadFile}>☁️</button>

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