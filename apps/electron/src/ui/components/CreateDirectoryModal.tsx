import React, {type ChangeEvent, type FC, useRef, useState} from "react";
import {useGlobalContext} from "./context/GlobalContext";

interface Props {
    currentPath: string;
    errors: string;
    setErrors: (_s: string) => void;
    modalVisible: boolean;
    setModalVisible: (_b: boolean) => void;
    callbackAddDirectory: (_s: string) => void;
}

export const CreateDirectoryModal: FC<Props> = ({currentPath, errors, setErrors, modalVisible, setModalVisible, callbackAddDirectory}) => {

    const [newDirectoryName, setNewDirectoryName] = useState("");

    const createDirectory = (): void => {
        if(newDirectoryName.length === 0){
            setErrors("Directory name cannot be empty!")
            return;
        }

      setErrors(""); // Clear any error
      setNewDirectoryName("");
      setModalVisible(false);  // Close the modal
      callbackAddDirectory(newDirectoryName); //Inform parent
    }

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
                                aria-label="Close">
                        </button>
                        <div className="modal-body" style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 0,
                            marginTop: '20px'
                        }}>
                            {errors ? <p className="text-danger">{errors}</p> : null}
                            <input type="text" placeholder="Directory Name" onChange={e => setNewDirectoryName(e.target.value)}/>
                            <button className="loc-btn" type="button" style={{marginTop: '30px', width: '200px'}}
                                    onClick={createDirectory}>
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            </div> :
            null
    )
}
