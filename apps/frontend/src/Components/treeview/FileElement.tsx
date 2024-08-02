import {type FC} from "react";
import {isString} from "@repo/common/RouteNames";
import {type FileDescription} from "@repo/common/FileDescription";
import {useGlobalContext} from "../../context/GlobalContext";

//Simpler version of FileElement
export const FileElement: FC<FileDescription> = ({filename, creationDate}) => {

    const dateObject = new Date(creationDate);

    const {routeNames} = useGlobalContext()

    const download = async (): Promise<void> => {
        const downloadResult = await routeNames.getNode.fun2({path: filename})

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
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    //TODO not a function
    const timestampToFormatDate =
        `${String(dateObject.getDate()).padStart(2, '0')}-${String(dateObject.getMonth() + 1).padStart(2, '0')}-${dateObject.getFullYear()} ${String(dateObject.getMinutes()).padStart(2, '0')}:${String(dateObject.getHours()).padStart(2, '0')}`;

    //TODO move download file call to so button maybe
    return (
        <div className="loc-card card-active" style={{marginTop: '20px'}} onClick={() => void download()}>
            <div className="loc-h-card-content-con">
                <div className="loc-h-card-content">
                    <img src="/images/svg/ic_pdf.svg" alt=""/>
                    <div>
                        <h4 style={{marginBottom: '5px'}}>{filename}</h4>
                        <h5>{timestampToFormatDate}</h5>
                    </div>
                </div>
                <div className="loc-h-tools">
                    <img src="/images/svg/ic_team_dropdown.svg" alt="more-options"/>
                    <img src="/images/svg/ic_share.svg" alt="more-options"/>
                    <img style={{width: '5px'}} src="/images/svg/ic_3_dots.svg" alt="more-options"/>
                </div>
            </div>
        </div>
    )
}
