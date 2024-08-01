import {FC, useState} from "react";
import {deleteNode, getNode, isString} from "@repo/common/RouteNames";

interface Props {
    name: string
}

export const FileElement: FC<Props> = ({name}) => {

    const [confirmDownload, setConfirmDownload] = useState(false);
    const [confirmRemove, setConfirmRemove] = useState(false);

    const download = async (): Promise<void> => {
        const downloadResult = await getNode.fun2({path: name})

        if (!downloadResult.isSuccessful) {
            return;
        }

        if (!isString(downloadResult.data)) {
            return;
        }

        const binaryString = window.atob(downloadResult.data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([bytes], {type: 'application/octet-stream'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    const remove = async () => {
        const deleteResult = await deleteNode.fun2({path: name});
        //TODO handle remove

    }


    return (
        <>
            <FileButton name={name} msg="Download" confirm={() => {
                setConfirmDownload(!confirmDownload);
            }}/>
            <FileButton name={name} msg="Remove" confirm={() => {
                setConfirmRemove(!confirmRemove);
            }}/>

            {confirmDownload ?
                <ConfirmButton name={name} msg="Download" confirmAction={download}
                                       confirm={() => setConfirmDownload(!confirmDownload)}/> : null
            }
            {confirmRemove ?
                <ConfirmButton name={name} msg="Remove" confirmAction={remove}
                                     confirm={() => setConfirmRemove(!confirmRemove)}/> : null
            }
            <br/>
        </>
    )
}

const FileButton: FC<{ name: string, msg: "Download" | "Remove", confirm: () => void }> = ({name, msg,  confirm}) =>
    <button type="button" key={name} onClick={confirm}>
        {msg === "Download" ?
            `🧾${name}`:
            "❌"
        }
    </button>

const ConfirmButton: FC<{
    name: string,
    msg: "Remove" | "Download",
    confirm: () => void,
    confirmAction: () => Promise<void>
}> = ({name, msg, confirmAction, confirm}) => (
    <button type="button" key={name} onClick={() => {
        confirm();
        void confirmAction()
    }}>
        Confirm {msg}
    </button>
)