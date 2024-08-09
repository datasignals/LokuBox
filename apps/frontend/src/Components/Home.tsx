import React, {type ChangeEvent, type FC, useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import "../css/loc-h-content.css"
import '../css/loc-layout.css';
import '../css/loc-login.css';
import '../css/main.css';

import {isDirRead} from "@repo/common/RouteNames";
import {type FileDescription} from "@repo/common/FileDescription";
import {useWallet} from '../context/WalletContext';
import {useGlobalContext} from "../context/GlobalContext";
import {FileElement} from "./treeview/FileElement";
import { Layout } from './Layout';

import {provenace} from '../config/config.json';

export const Home: FC = () => {
    const navigate = useNavigate();
    const {currentAccount} = useWallet();

    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropZoneRef = useRef<HTMLDivElement | null>(null);
    const [files, setFiles] = useState<FileDescription[]>([]);
    const [droppedFile, setDroppedFile] = useState<File | null>(null);
    const [provenanceData, setProvenanceData] = useState<any[]>([]); // Provenance
    const [errors, setErrors] = useState("");

    const handleNavigation = (path: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        navigate(path);
    };

    const {routeNames} = useGlobalContext();

    //TODO only fetches root
    const fetchNfsContents = (): void => {
        routeNames.getNode.fun2({path: "/"})
            .then(e => {
                const nodeInfo = e.data
                if (isDirRead(nodeInfo)) {
                    console.log("nodeInfo.files", nodeInfo.files);
                    setFiles(nodeInfo.files)
                }
            })
            .catch((e: unknown) => null)
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
          //  setDroppedFile(files[0]);
            setErrors("");
        }
    };

    const handleDropZoneClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    useEffect(() => {
        fetchNfsContents();

        if (localStorage.getItem("currentAccount")) {
            navigate("")
        }
    }, [])


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
                    fetchNfsContents();
                })
                    .catch(() => null);
            }
        }
        console.log("here 2")

        a.readAsText(droppedFile, "base64")
        alert("File is uploaded.")
    }

    const handleButtonClick = (): void => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];
        if (file && event.target.files?.length) {
            // uploadFile(file);
            setDroppedFile(file);
        }
    };

    const fetchProvenance = async () => {
        console.log("INSIDE FETCH")
        try {
            // const response = await fetch('http://localhost:3005/events/accountId?accountId=5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY');
            const accountId = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
            const fileName = 'abc.txt';
            const response = await fetch(`${provenace.server}/events/filerecords?accountId=${accountId}&fileName=${fileName}`);
            // const response = await fetch('http://localhost:3005/events/filerecords?accountId=5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY&fileName=abc.txt');
            // / Log the entire response for debugging
            console.log("RESPONSE OBJECT", response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log("DATA",data)
            if(data.success == true && data.status == "Connected"){
                console.log("DATA IN IF",typeof(data.data))
                setProvenanceData(data.data.value);
                console.log("PRO",provenanceData);
            }
        } catch (error) {
            console.error("FETCH ERROR", error); 
        }
    };

    useEffect(()  =>  {
        fetchNfsContents;
    },[files])

    return (
        <div>
            {/* <div className="loc-nav" id="loc-nav">
                <div className="loc-sidemenu-toggler" id="loc-sidemenu-toggler">
                    <div className="loc-logo">
                        <img src="/images/svg/logo.svg" alt="brand-logo"/>
                    </div>
                    <div className="loc-nav-ham">Files</div>
                </div>
                <ul className="loc-nav-menu">
                    <li>
                        {currentAccount ? <span
                            style={{margin: "10px"}}>{currentAccount.slice(0, 6)}...{currentAccount.slice(-6)}</span> : null}
                        <img src="/images/svg/user_default.svg" alt="user"/>
                    </li>
                </ul>
            </div>
            <div className="loc-sidemenu">
                <ul>
                    <li className="loc-sidemenu-item active">
                        <a href="/" className="loc-sidemenu-item-content" onClick={handleNavigation('/')}>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 width="36.047" height="40.553" viewBox="0 0 36.047 40.553">
                                <path
                                    id="s_files"
                                    d="M2.253,40.553A2.253,2.253,0,0,1,0,38.3V11.264A2.253,2.253,0,0,1,2.253,9.012H13.518L24.782,20.276V38.3a2.253,2.253,0,0,1-2.253,2.254ZM13.518,20.276H21.6L13.518,12.2ZM28.162,31.541V18.877L14.918,5.632H11.264V2.253A2.253,2.253,0,0,1,13.518,0H24.782L36.047,11.264V29.288a2.253,2.253,0,0,1-2.253,2.254Zm-3.38-20.277h8.078L24.782,3.186Z"
                                />
                            </svg>
                            <div className="loc-sidemenu-item-name">My Files</div>
                        </a>
                    </li>
                    <li className="loc-sidemenu-item">
                        <a href="/" className="loc-sidemenu-item-content" onClick={handleNavigation('/')}>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 width="24.871" height="27.558" viewBox="0 0 24.871 27.558">
                                <path
                                    id="s_share"
                                    d="M23.726,21.479a4.021,4.021,0,0,0-2.708,1.065L11.166,16.8a4.534,4.534,0,0,0,.124-.968,4.534,4.534,0,0,0-.124-.968L20.907,9.18a4.142,4.142,0,1,0-1.326-3.03,4.534,4.534,0,0,0,.124.968L9.964,12.8a4.15,4.15,0,1,0,0,6.059L19.8,24.619a3.907,3.907,0,0,0-.111.9,4.035,4.035,0,1,0,4.035-4.04Z"
                                    transform="translate(-3 -2)"
                                    fill="#c0c5d9"
                                    fillRule="evenodd"
                                />
                            </svg>
                            <div className="loc-sidemenu-item-name">Shared</div>
                        </a>
                    </li>
                    <li className="loc-sidemenu-item">
                        <a href="/" className="loc-sidemenu-item-content" onClick={handleNavigation('/')}>
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 width="39.022" height="36.077" viewBox="0 0 39.022 36.077">
                                <path
                                    id="s_team"
                                    d="M-3284.44,149.062a31.452,31.452,0,0,1,.275-3.661,1.452,1.452,0,0,1,.784-1.056c1.363-.679,4.353-1.683,4.353-1.683v-.988l-.084-.062a2.858,2.858,0,0,1-1.084-1.816l-.017-.105h-.081a1.1,1.1,0,0,1-1.021-.687,1.2,1.2,0,0,1-.15-.582,1.12,1.12,0,0,1,.078-.41.572.572,0,0,1,.222-.356l.275-.167-.068-.3a3.467,3.467,0,0,1,3.445-4.183c.055,0,.109,0,.163,0s.109,0,.164,0a3.467,3.467,0,0,1,3.445,4.183l-.069.3.275.167a.574.574,0,0,1,.221.356,1.1,1.1,0,0,1,.079.41,1.2,1.2,0,0,1-.151.582,1.1,1.1,0,0,1-1.021.687h-.081l-.016.105a2.856,2.856,0,0,1-1.085,1.816l-.083.062v.988s2.991,1,4.353,1.683a1.453,1.453,0,0,1,.784,1.056,31.56,31.56,0,0,1,.275,3.662Zm-24.841,0a31.292,31.292,0,0,1,.275-3.662,1.452,1.452,0,0,1,.784-1.056c1.363-.679,4.354-1.683,4.354-1.683v-.988l-.083-.062a2.86,2.86,0,0,1-1.085-1.816l-.016-.105h-.081a1.1,1.1,0,0,1-1.022-.687,1.2,1.2,0,0,1-.15-.582,1.1,1.1,0,0,1,.078-.41.573.573,0,0,1,.221-.356l.275-.167-.068-.3a3.468,3.468,0,0,1,3.445-4.183c.055,0,.11,0,.164,0s.108,0,.163,0a3.467,3.467,0,0,1,3.445,4.183l-.069.3.276.167a.574.574,0,0,1,.221.356,1.12,1.12,0,0,1,.078.41,1.2,1.2,0,0,1-.15.582,1.1,1.1,0,0,1-1.021.687h-.081l-.017.105a2.858,2.858,0,0,1-1.084,1.816l-.084.062v.988s2.991,1,4.353,1.683a1.453,1.453,0,0,1,.784,1.056,31.56,31.56,0,0,1,.275,3.662Zm22.9-9.391-3.323-1.92-3.323,1.919a.9.9,0,0,1-.441.118.884.884,0,0,1-.771-.439.894.894,0,0,1,.322-1.213l3.323-1.92v-3.838a.889.889,0,0,1,.889-.888.9.9,0,0,1,.888.884v3.842l3.323,1.919a.879.879,0,0,1,.411.54.88.88,0,0,1-.088.673.891.891,0,0,1-.77.441A.89.89,0,0,1-3286.383,139.671Zm-10.468-10.627a31.805,31.805,0,0,1,.274-3.662,1.454,1.454,0,0,1,.784-1.055c1.363-.68,4.353-1.684,4.353-1.684v-.987l-.083-.063a2.854,2.854,0,0,1-1.084-1.815l-.017-.105h-.081a1.1,1.1,0,0,1-1.021-.688,1.2,1.2,0,0,1-.15-.581,1.1,1.1,0,0,1,.078-.41.571.571,0,0,1,.221-.356l.276-.167-.068-.3a3.467,3.467,0,0,1,3.444-4.184h.328a3.469,3.469,0,0,1,3.445,4.184l-.069.3.276.167a.571.571,0,0,1,.221.356,1.1,1.1,0,0,1,.078.41,1.2,1.2,0,0,1-.15.581,1.1,1.1,0,0,1-1.021.688h-.081l-.016.105a2.856,2.856,0,0,1-1.085,1.815l-.083.063v.987s2.991,1,4.354,1.684a1.453,1.453,0,0,1,.784,1.055,31.751,31.751,0,0,1,.275,3.662Z"
                                    transform="translate(3309.281 -112.985)"
                                    fill="#c0c5d9"
                                />
                            </svg>
                            <div className="loc-sidemenu-item-name">Teams</div>
                        </a>
                    </li>
                </ul>
            </div> */}
            <Layout />
            <div className="loc-content-container">
                <div className="loc-h-content-o">
                    <div className="row">
                        <div className="col-12">
                            <div className="loc-card loc-h">
                                <div className="position-relative" style={{width: '350px'}}>
                                    <input style={{width: '350px'}} type="text" className="loc-form-control"
                                           placeholder="Search"/>
                                    <img style={{position: 'absolute', top: '12px', right: '15px'}}
                                         src="/images/svg/ic_search.svg" alt=""/>
                                </div>
                            </div>
                            <FilesComponent files={files}/>
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
                                <h4 style={{marginBottom: '5px'}} onClick={fetchProvenance}>thisisfake.pdf</h4>
                                <h5 style={{marginBottom: '5px'}}>fakemb10.10mb</h5>
                                <h5>25-10-2024, 10:30 AM</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="loc-h-activity-content-con">
                    <h4 style={{fontSize: '14px', marginLeft: '20px'}}>Activities</h4>
                    <div className="loc-card-provnance" style={{height: '100%'}}>
                        {/* <div className="loc-h-activity-content"> */}
                            {/* <div style={{fontSize: '14px'}}>Accessed On</div>
                            <div style={{fontSize: '14px'}}>25-02-2024 10:20 AM</div> */}
                    {errors ? (
                        <div style={{ fontSize: '14px', color: 'red' }}>{errors}</div>
                    ) : (
                        provenanceData.length > 0 ? (
                            provenanceData.map((item, index) => (
                                <div key={index} style={{ marginBottom: '10px' }}>
                                    <div style={{ fontSize: '14px' }}><strong>Accessed On:</strong> {item.value.creationtime}</div>
                                    <div style={{ fontSize: '14px' }}><strong>Accessed by:</strong> {item.value.eventkey}</div>
                                    <div style={{ fontSize: '14px' }}><strong>Action:</strong> {item.value.eventtype}</div>
                                    <hr style={{ margin: '10px 0', border: '1px solid #ccc' }} />
                                </div>
                            ))
                        ) : (
                            <div style={{ fontSize: '14px' }}>No File Selected.</div>
                        )
                    )}
                        {/* </div> */}
                    </div>
                </div>
            </div>
            <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content" style={{ borderRadius: '20px' }}>
                        <button type="button" style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 999, fontSize: '12px' }}
                            className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '70px' }}>
                            <div className="drop-zone" ref={dropZoneRef} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={handleDropZoneClick}>
                                <span className="drop-zone__prompt" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <img src={'../../public/assets/images/svg/ic_cloud.svg'} style={{ width: '48px', marginBottom: '20px' }} alt="" />
                                    {droppedFile?.name ? <span>{droppedFile.name}</span> : <span>Drop file here or click to upload</span>}
                                    {(!droppedFile?.name && errors) && <p className="text-danger">{errors}</p>}
                                </span>
                                <input ref={fileInputRef} type="file" name="file" className="drop-zone__input" style={{ display: 'none' }} onChange={handleFileChange}/>
                            </div>
                            <button className="loc-btn" type="button" style={{ marginTop: '30px', width: '200px' }} onClick={uploadFile}>
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <button data-bs-toggle="modal" data-bs-target="#exampleModal" className="loc-transparent-img-btn" style={{ position: 'fixed', bottom: '40px', right: '420px', zIndex: 50 }}>
                <img src={'/images/svg/ic_upload_file.svg'} alt="" />
            </button>
            <div>
                {/*TODO replace the a by button later*/}
                {/* <a data-bs-toggle="modal" data-bs-target="#exampleModal" type="button" onClick={handleButtonClick}
                        style={{position: 'fixed', bottom: '40px', right: '420px', zIndex: 50}}>
                    <img src="/images/svg/ic_upload_file.svg" alt="Upload"/>
                </a> */}
                {/* <input
                    type="file"
                    name="file"
                    ref={fileInputRef}
                    id="artifactFile"
                    style={{display: 'none'}}
                    // style={{position: 'fixed', bottom: '40px', right: '420px', zIndex: 50}}
                    onChange={handleFileChange}
                /> */}
            </div>
        </div>
    );
};

const FilesComponent: FC<{ files: FileDescription[] }> = ({ files }) => {
    // Sort files by creationDate in descending order
    const sortedFiles = [...files].sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());

    return (
        <>
            {sortedFiles.map(file => (
                <FileElement
                    key={file.filename}
                    filename={file.filename}
                    creationDate={file.creationDate}
                />
            ))}
        </>
    );
};
// .loc-card {
//     max-height: 500px; /* Adjust this value as needed */
//     overflow-y: auto;  /* Enable vertical scrolling */
//     padding: 10px;     /* Optional: Add some padding */
//     border: 1px solid #ccc; /* Optional: Add a border for visual separation */
//     border-radius: 4px; /* Optional: Add rounded corners */
// }

// .loc-h-activity-content-con {
//     width: 100%;
//     height: 100%; /* Ensure the container takes full height if needed */
//     box-sizing: border-box; /* Include padding and border in the element's total width and height */
// }