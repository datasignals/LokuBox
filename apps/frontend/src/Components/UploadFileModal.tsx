import React, {type ChangeEvent, type FC, useRef, useState} from "react";
import {Bounce, toast} from "react-toastify";
import {useGlobalContext} from "../context/GlobalContext";

interface Props {
    errors: string;
    setErrors: (_s: string) => void;
    modalVisible: boolean;
    setModalVisible: (_b: boolean) => void;
}

export const UploadFileModal: FC<Props> = ({errors, setErrors, modalVisible, setModalVisible}) => {

    const [droppedFile, setDroppedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropZoneRef = useRef<HTMLDivElement | null>(null);

    const {routeNames} = useGlobalContext();

    const uploadFile = (): void => {
        if (!droppedFile) {
            setErrors('No file selected');
            return;
        }
        const a = new FileReader();

        a.onload = (e) => {
            if (e.target) { //TODO extra check
                routeNames.putNode.fun2({
                    path: `/${droppedFile.name}`,
                    isDirectory: false,
                    content: e.target.result as string //TODO force casting
                }).then(() => {
                    setDroppedFile(null); // Clear the selected file
                    setErrors(""); // Clear any error
                    setModalVisible(false);  // Close the modal
                }).catch(() => null);
            }
        }
        console.log("here 2")

        a.readAsText(droppedFile, "base64")
        toast.success("File is uploaded.", {
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
            setErrors("");
        }
    };

    const handleDropZoneClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];
        if (file && event.target.files?.length) {
            setDroppedFile(file);
        }
    };


    return (
        modalVisible ?
            <div className="modal fade show" style={{display: 'block'}} tabIndex={-1}
                 aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content" style={{borderRadius: '20px', padding: '30px'}}>
                        <button type="button" style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            zIndex: 999,
                            fontSize: '10px'
                        }}
                                className="btn-close" onClick={() => setModalVisible(false)}
                                aria-label="Close"></button>
                        <div className="modal-body" style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 0,
                            marginTop: '20px'
                        }}>
                            <div className="drop-zone" ref={dropZoneRef} onDragOver={handleDragOver}
                                 onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={handleDropZoneClick}>
                                <span className="drop-zone__prompt" style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <img src={'/images/svg/ic_cloud.svg'}
                                         style={{width: '48px', marginBottom: '20px'}} alt=""/>
                                    {droppedFile?.name ? <span>{droppedFile.name}</span> :
                                        <span>Drop file here or click to upload</span>}
                                    {(!droppedFile?.name && errors) && <p className="text-danger">{errors}</p>}
                                </span>
                                <input ref={fileInputRef} type="file" name="file" className="drop-zone__input"
                                       style={{display: 'none'}} onChange={handleFileChange}/>
                            </div>
                            <button className="loc-btn" type="button" style={{marginTop: '30px', width: '200px'}}
                                    onClick={uploadFile}>
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            </div> :
            null
    )
}