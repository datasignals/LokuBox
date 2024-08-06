import React, {type ChangeEvent, type FC, useEffect, useRef, useState} from 'react';
import {isString} from "@repo/common/RouteNames";
import {type FileDescription} from "@repo/common/FileDescription";
import {useGlobalContext} from "../../context/GlobalContext";


import "../../../public/images/svg/user_default.svg"
//Simpler version of FileElement
export const FileElement: FC<FileDescription> = ({filename, creationDate}) => {

    const dateObject = new Date(creationDate);


    const {routeNames} = useGlobalContext()

    // const download = async (): Promise<void> => {
    //     const downloadResult = await routeNames.getNode.fun2({path: filename})

    //     if (!downloadResult.isSuccessful) {
    //         return;
    //     }

    //     if (!isString(downloadResult.data)) {
    //         return;
    //     }

    //     const binaryString = window.atob(downloadResult.data);
    //     const len = binaryString.length;
    //     const bytes = new Uint8Array(len);
    //     for (let i = 0; i < len; i++) {
    //         bytes[i] = binaryString.charCodeAt(i);
    //     }

    //     const blob = new Blob([bytes], {type: 'application/octet-stream'});
    //     const url = window.URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = filename;
    //     document.body.appendChild(a);
    //     a.click();
    //     document.body.removeChild(a);
    //     window.URL.revokeObjectURL(url);
    // }

    //TODO not a function
    const timestampToFormatDate =
        `${String(dateObject.getDate()).padStart(2, '0')}-${String(dateObject.getMonth() + 1).padStart(2, '0')}-${dateObject.getFullYear()} ${String(dateObject.getMinutes()).padStart(2, '0')}:${String(dateObject.getHours()).padStart(2, '0')}`;

    //TODO move download file call to so button maybe
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropZoneRef = useRef<HTMLDivElement | null>(null);
    const [droppedFile, setDroppedFile] = useState<File | null>(null);
    const [errors, setErrors] = useState("");

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (dropZoneRef.current) {
            dropZoneRef.current.classList.add('drop-zone--over');
        }
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (dropZoneRef.current) {
            dropZoneRef.current.classList.remove('drop-zone--over');
        }
    };
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (dropZoneRef.current) {
            dropZoneRef.current.classList.remove('drop-zone--over');
        }
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            if (fileInputRef.current) {
                fileInputRef.current.files = files;
            }
          //  setDroppedFile(files[0]);
            setErrors("");
        }
    };

    const handleDropZoneClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const uploadFile = (): void => {
        if (!droppedFile) {
            setErrors('No file selected');
            return;
        }
        console.log("here")
        const a = new FileReader();

        a.onload = (e) => {
            if (e.target) { //TODO extra check
                routeNames.putNode.fun2({
                    path: `/${droppedFile.name}`,
                    isDirectory: false,
                    content: e.target.result as string //TODO force casting
                }).then(() => {
                })
                    .catch(() => null);
            }
        }
        console.log("here 2")

        a.readAsText(droppedFile, "base64")
        alert("File is uploaded.")
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];
        if (file) {
            // uploadFile(file);
            setDroppedFile(file);
        }
    };
    return (
        <div className="loc-card card-active" style={{marginTop: '20px'}}>
            <div className="loc-h-card-content-con">
                <div className="loc-h-card-content">
                    <img src="/images/svg/ic_pdf.svg" alt=""/>
                    <div>
                        <h4 style={{marginBottom: '5px'}}>{filename}</h4>
                        <h5>{timestampToFormatDate}</h5>
                    </div>
                </div>
                <div className="loc-h-tools">
                    <div className="dropdown">
                        <img className="dropdown-toggle" src={'../../../public/images/svg/ic_team_dropdown.svg'} alt="more-options" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"/>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li className="dropdown-item">
                                    <img style={{width : "35px"}} src={'../../../public/images/svg/user_default.svg'} alt="user" />
                                    <div>Jason Roy</div>
                                </li>
                                <li className="dropdown-item">
                                    <img style={{width : "35px"}} src={'../../../public/images/svg/user_default.svg'} alt="user" />
                                    <div>Jos Butler</div>
                                </li>
                                <li className="dropdown-item">
                                    <img style={{width : "35px"}} src={'../../../public/images/svg/user_default.svg'} alt="user" />
                                    <div>Ian Bell</div>
                                </li>
                            </ul>
                    </div>
                    <img style={{ cursor: 'pointer' }} src={'../../../public/images/svg/ic_share.svg'} alt="more-options" data-bs-toggle="modal" data-bs-target="#shareModal" />
                    <div className="dropdown">
                        <img className="dropdown-toggle" style={{width : "5px"}} src={'../../../public/images/svg/ic_3_dots.svg'} alt="more-options" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false"/>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton2">
                            <li className="dropdown-item">Delete</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="shareModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content" style={{ borderRadius: '20px', padding: '30px' }}>
                        <button type="button" style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 999, fontSize: '10px' }}
                            className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        <div className="loc-h-share-title">Share File</div>
                        <div className="loc-h-share-content">
                            <img src={'../../public/assets/images/svg/ic_pdf.svg'} alt=""/>
                            <div style={{ marginLeft: '10px' }}>
                                <h4 style={{ marginBottom: '5px' }}>newfiles.pdf</h4>
                                <h5>27-10-2024, 10:30 AM</h5>
                            </div>
                        </div>
                        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 0, marginTop: '20px' }}>
                            <form style={{ width: '100%' }}>
                                <div style={{ width: '100%' }}>
                                    <label htmlFor="loc-user-select" className="loc-label">
                                        Enter User's Wallet Id
                                    </label>
                                    <select className="loc-form-control" id="loc-user-select" style={{ width: '100%', padding: '0 10px' }}>
                                        <option>Coinbase</option>
                                        <option>Wallet 2</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', fontSize: '12px', justifyContent: 'center', width: '100%', marginTop: '20px', color: '#8B959B' }}>OR</div>
                                <div style={{ width: '100%', marginTop: '20px', fontSize: '10px', color: '' }}>
                                    <label htmlFor="loc-login-select" className="loc-label">
                                        Enter User's Wallet Id
                                    </label>
                                    <input className="form-control" />
                                </div>
                            </form>
                            <button className="loc-btn" type="button" style={{ marginTop: '30px', width: '200px' }} onClick={uploadFile}>
                                Share
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
