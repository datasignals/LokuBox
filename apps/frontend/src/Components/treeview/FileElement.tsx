import React, {type ChangeEvent, type FC, useEffect, useRef, useState} from 'react';
import {Bounce, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {useGlobalContext} from "../../context/GlobalContext";
import {ShareFileModal} from "../ShareFileModal";
import {FileToShare, type FileDescription, getDateTime} from "@repo/common/Models";


//Simpler version of FileElement
export const FileElement: FC<FileDescription> = ({filename, creationDate}) => {

    const {routeNames} = useGlobalContext();

    const [selectFile, setSelectFile] = useState<FileToShare | null>(null);

    const handleDeleteFile = (filePath: string) => {
        // if (!window.confirm(`Are you sure you want to delete ${filePath}?`)) {
        //     return;
        // }
        routeNames.deleteNode.fun2({ path: filePath }).then(response => {
            if (response.isSuccessful) {
                toast.info("File deleted successfully.", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: 0,
                    theme: "dark",
                    transition: Bounce,
                });
            } else {
                toast.warning("Failed to delete the file. Please try again.", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: 0,
                    theme: "dark",
                    transition: Bounce,
                });
            }
            }).catch((error: unknown) => {
                console.error('Error deleting file:', error);
                toast.error("An error occurred while deleting the file. Please try again.", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: 0,
                    theme: "dark",
                    transition: Bounce,
                });
            });
    };

    return (
        <div className="loc-card card-active" style={{marginTop: '20px'}}>
            <div className="loc-h-card-content-con">
                <div className="loc-h-card-content">
                    <img src="/images/svg/ic_pdf.svg" alt=""/>
                    <div>
                        <h4 style={{marginBottom: '5px'}}>{filename}</h4>
                        <h5>{getDateTime(creationDate)}</h5>
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
                    <img style={{ cursor: 'pointer' }} src={'../../../public/images/svg/ic_share.svg'} alt="more-options" data-bs-toggle="modal" data-bs-target="#shareModal" onClick={() => setSelectFile({ filename, creationDate })}/>
                    <div className="dropdown">
                        <img className="dropdown-toggle" style={{width : "5px"}} src={'../../../public/images/svg/ic_3_dots.svg'} alt="more-options" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false"/>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton2">
                            <li className="dropdown-item" onClick={() => handleDeleteFile(filename)}>Delete</li>
                        </ul>
                    </div>
                </div>
            </div>

            <ShareFileModal
                selectedFile={selectFile}
                setSelectedFile={setSelectFile}
            />
        </div>
    )
}

