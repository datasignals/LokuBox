import {FC, useState} from "react";
import {getNode, isString} from "@repo/common/RouteNames";

interface Props {
    name: string
}

export const FileElement: FC<Props> = ({name}) => {

    const [confirm, setConfirm] = useState(false);

    const download = async (): Promise<void> => {
        const downloadResult = await getNode.fun2({path: name})

        if (!downloadResult.isSuccessful) {
            return;
        }

        if(!isString(downloadResult.data)) {
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


    return (
        <>
            <FileButton name={name} confirm={() => { setConfirm(!confirm); }}/>
            {confirm ?
                <ConfirmButton name={name} download={download} confirm={() => setConfirm(!confirm)}/> : null
            }
            <br/>
        </>
    )
}

const FileButton: FC<{ name: string, confirm: () => void }> = ({name, confirm}) =>
    <button type="button" key={name} onClick={confirm}>
        {`🧾${name}`}
    </button>

const ConfirmButton: FC<{
    name: string,
    confirm: () => void,
    download: () => Promise<void>
}> = ({name, download, confirm}) => (
    <button type="button" key={name} onClick={() => {
        confirm();
        void download()
    }}>
        ✅
    </button>
)
