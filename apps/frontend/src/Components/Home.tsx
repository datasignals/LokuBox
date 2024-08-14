import React, {type ChangeEvent, type FC, useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate, useParams, useResolvedPath} from 'react-router-dom';
import "../css/loc-h-content.css"
import '../css/loc-layout.css';
import '../css/loc-login.css';
import '../css/main.css';
import {Bounce, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {isDirRead} from "@repo/common/RouteNames";
import {type FileDescription} from "@repo/common/Models";
import {useWallet} from '../context/WalletContext';
import {useGlobalContext} from "../context/GlobalContext";
import {FileElement} from "./treeview/FileElement";
import {Layout} from './Layout';

import {DirectoryElement} from "./treeview/DirectoryElement";
import {UploadFileModal} from "./UploadFileModal";

export const Home: FC<{ routePath: string }> = ({routePath}) => {
    const navigate = useNavigate();
    const {currentAccount} = useWallet();

    const [files, setFiles] = useState<FileDescription[]>([]);
    const [directories, setDirectories] = useState<string[]>([]);
    const [filesselected, setFilesselected] = useState<FileDescription | null>(null);
    const [provenanceData, setProvenanceData] = useState<any[]>([]); // Provenance
    const [errors, setErrors] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    const {'*': splat} = useParams<{ "*": string }>();

    const path = splat ?
        `/${splat}` :
        "/";

    const {routeNames} = useGlobalContext();

    const fetchNfsContents = (): void => {
        routeNames.getNode.fun2({path})
            .then(e => {
                const nodeInfo = e.data
                if (isDirRead(nodeInfo)) {
                    setFiles(nodeInfo.files)
                    setDirectories(nodeInfo.directories)
                }
            })
            .catch((e: unknown) => null)//TODO improve error catching
    }


    useEffect(() => {
        fetchNfsContents();
    }, [path, modalVisible]) //Hook to a path so that it will refresh file contents when path changes

    const handleModal = (): void => {
        setModalVisible(true);  // Close the modal
    };

    const handleFileSelect = (file: FileDescription): void => {
        // Here you can handle the file selection, such as fetching its provenance
        setFilesselected(file)
        void fetchProvenance(file.filename);
    };

    const handleDirectorySelect = (dirName: string): void => {
        navigate(`${location.pathname}/${dirName}`);
    };

    const fetchProvenance = async (filename: string) => {
        console.log("INSIDE FETCH", filename)
        console.log("DA", filesselected)
        try {
            console.log("RESPONSE OBJECT", currentAccount, filename);
            // const response = await fetch('http://localhost:3005/events/accountId?accountId=5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY');
            const accountId = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
            const fileName = 'abc.txt';
            // const response = await fetch(`${provenace.server}/events/filerecords?accountId=${currentAccount}&fileName=${fileName}`);
            const response = await fetch('http://localhost:3005/events/filerecords?accountId=5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY&fileName=abc.txt');
            // / Log the entire response for debugging
            console.log("RESPONSE OBJECT", response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log("DATA", data, typeof (data.data.value))
            if (data.success === true && data.status === "Connected") {
                console.log("DATA IN IF", typeof (data.data.value))
                setProvenanceData(data.data.value);
                console.log("PRO", provenanceData);
            }
        } catch (error) {
            console.error("FETCH ERROR", error);
        }
    };

    // Function to format the timestamp
    const formatDate = (timestamp: number): string => {
        const date = new Date(timestamp);
        return `${date.toLocaleDateString()}, ${date.toLocaleTimeString()}`;
    };

    const handleGoDirUp = (): void => {
        if (path === "/" || path === routePath) {
            return;
        }

        const trimmedPath = path.replace(/\/$/, '');
        const lastSlashIndex = trimmedPath.lastIndexOf('/');
        const slicedPath = trimmedPath.substring(0, lastSlashIndex)

        navigate(routePath + slicedPath)
    }

    return (
        <div>
            <Layout/>
            <div className="loc-content-container">
                <div className="loc-h-content-o">
                    <div className="row">
                        <div className="col-12">
                            <div className="loc-card loc-h">
                                <div className="position-relative" style={{width: '350px'}}>
                                    <input style={{width: '350px'}} type="text" className="loc-form-control"
                                           placeholder="Search"/>
                                    {
                                        path !== "/" ?
                                            <button type="button" onClick={handleGoDirUp}>DIR UP</button> :
                                            null
                                    }
                                    <img style={{position: 'absolute', top: '12px', right: '15px'}}
                                         src="/images/svg/ic_search.svg" alt=""/>
                                </div>
                            </div>
                            <div>
                                <FilesComponent
                                    files={files}
                                    onFileSelect={handleFileSelect}
                                />
                                <DirectoryComponent
                                    directories={directories}
                                    onDirectorySelect={handleDirectorySelect}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="loc-h-content-details">
                <div className="loc-h-content-title">
                    Provenance Report
                </div>
                <div className="loc-card" style={{marginTop: '20px'}}>
                    <div className="loc-card-content">
                        <div className="loc-h-card-content">
                            <img src="/images/svg/ic_pdf.svg" alt=""/>
                            <div>
                                <h4 style={{marginBottom: '5px'}}>
                                    {filesselected ? filesselected.filename : 'No file selected'}
                                </h4>
                                <h5 style={{marginBottom: '5px'}}>10mb</h5>
                                <h5>{filesselected ? formatDate(filesselected.creationDate) : ''}</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="loc-h-activity-content-con">
                    <h4 style={{fontSize: '14px', marginLeft: '20px'}}>Activities</h4>
                    <div className="loc-card-provnance" style={{height: '100%'}}>
                        <ErrorsComponent
                            errors={errors}
                            provenanceData={provenanceData}
                        />
                    </div>
                </div>
            </div>
            <UploadFileModal
                errors={errors}
                setErrors={setErrors}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
            />

            <button data-bs-toggle="modal" data-bs-target="#exampleModal" className="loc-transparent-img-btn"
                    style={{position: 'fixed', bottom: '40px', right: '420px', zIndex: 50}}>
                <img src={'/images/svg/ic_upload_file.svg'} onClick={handleModal} alt=""/>
            </button>
        </div>
    );
};


interface FilesComponentProps {
    files: FileDescription[];
    onFileSelect: (_file: FileDescription) => void;
}

const FilesComponent: FC<FilesComponentProps> = ({files, onFileSelect}) => {
    // Sort files by creationDate in descending order
    const sortedFiles = files
        .sort((a, b) =>
            new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
        );

    return (
        <>
            {sortedFiles.map(file => (
                <div key={file.filename} onClick={() => onFileSelect(file)}>
                    <FileElement
                        key={file.filename}
                        filename={file.filename}
                        creationDate={file.creationDate}
                    />
                </div>
            ))}
        </>
    );
};

interface DirectoryComponentProps {
    directories: string[];
    onDirectorySelect: (_directory: string) => void;
}

const DirectoryComponent: FC<DirectoryComponentProps> = ({directories, onDirectorySelect}) => <>
    {directories.map(dirName => (
        <div key={dirName}>
            <DirectoryElement
                key={dirName}
                dirName={dirName}
                handleEnterDirectory={() => onDirectorySelect(dirName)}
            />
        </div>
    ))}
</>


interface ErrorsProps {
    errors: string;
    provenanceData: any[];
}

const ErrorsComponent: FC<ErrorsProps> = ({errors, provenanceData}) => {

    console.log("provenanceData: " + JSON.stringify(provenanceData, null, 2));

    if (errors) {
        return (
            <div style={{fontSize: '14px', color: 'red'}}>{errors}</div>
        )
    } else if (provenanceData.length > 0) {
        provenanceData.map((item, index) => (
            <div key={index} style={{marginBottom: '10px'}}>
                <div style={{fontSize: '14px'}}><strong>Accessed
                    On:</strong> {item.value.creationtime}</div>
                <div style={{fontSize: '14px'}}><strong>Accessed
                    by:</strong> {item.value.eventkey}</div>
                <div style={{fontSize: '14px'}}><strong>Action:</strong> {item.value.eventtype}
                </div>
                <hr style={{margin: '10px 0', border: '1px solid #ccc'}}/>
            </div>
        ))
    } else {
        <div style={{fontSize: '14px'}}>No File Selected.</div>
    }
}
