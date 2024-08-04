import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "../../public/assets/css/loc-content.css";
import '../../public/assets/css/loc-layout.css';
import '../../public/assets/css/loc-login.css';
import '../../public/assets/css/main.css';
import { useWallet } from '../context/walletContext';
import Layout from './Layout';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { isWalletConnected, currentAccount, setWalletConnected, walletData } = useWallet();

    const dropZoneRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [droppedFile, setDroppedFile] = useState<File | null>(null);
    const [errors, setErrors] = useState("");

    const handleNavigation = (path: string) => (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
        navigate(path);
    };

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
            setDroppedFile(files[0]);
            setErrors("");
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setDroppedFile(files[0]);
        }
    };

    const handleDropZoneClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };


    const uploadFile = async () =>  {
        if (!droppedFile) {
            setErrors('No file selected');
            return;
        }

        const formData = new FormData();
        formData.append('file', droppedFile);
        const response = await axios.post(`http://localhost:3001/upload`, 
            formData,{ headers: {
                'Content-Type': 'multipart/form-data' // Make sure to set the content type as multipart/form-data
            }}).catch((e: any)  =>  {
                console.log("e", e);
            })

        console.log("response", response);
        if(response?.status == 200)
        {
            alert(response?.data);
        }
    }
    useEffect(() => {
        if (currentAccount || localStorage.getItem("currentAccount")) {
            navigate("");
        }
    }, [currentAccount, navigate]);

    return (
        <div>
            <Layout />
            <div className="loc-content-container">
                <div className="loc-h-content-o">
                    <div className="row">
                        <div className="col-12">
                            <div className="loc-card loc-h">
                                <div className="position-relative" style={{ width: '350px' }}>
                                    <input style={{ width: '350px' }} type="text" className="loc-form-control" placeholder="Search" />
                                    <img style={{ position: 'absolute', top: '12px', right: '15px' }} src={'../../public/assets/images/svg/ic_search.svg'} alt="" />
                                </div>
                            </div>
                            <div className="loc-card card-active" style={{ marginTop: '20px' }}>
                                <div className="loc-h-card-content-con">
                                    <div className="loc-h-card-content">
                                        <img src={'../../public/assets/images/svg/ic_pdf.svg'} alt=""/>
                                        <div>
                                            <h4 style={{ marginBottom: '5px' }}>myfiles.pdf</h4>
                                            <h5>25-10-2024, 10:30 AM</h5>
                                        </div>
                                    </div>
                                    <div className="loc-h-tools">
                                        <div className="dropdown">
                                            <img className="dropdown-toggle" src={'../../public/assets/images/svg/ic_team_dropdown.svg'} alt="more-options" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"/>
                                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                <li className="dropdown-item">
                                                    <img src={'../../public/assets/images/svg/default_user.svg'} alt="user" />
                                                    <div>Jason Roy</div>
                                                </li>
                                                <li className="dropdown-item">
                                                    <img src={'../../public/assets/images/svg/default_user.svg'} alt="user" />
                                                    <div>Jos Butler</div>
                                                </li>
                                                <li className="dropdown-item">
                                                    <img src={'../../public/assets/images/svg/default_user.svg'} alt="user" />
                                                    <div>Ian Bell</div>
                                                </li>
                                            </ul>
                                        </div>
                                        <img style={{ cursor: 'pointer' }} src={'../../public/assets/images/svg/ic_share.svg'} alt="more-options" data-bs-toggle="modal" data-bs-target="#shareModal"/>
                                        <div className="dropdown">
                                            <img className="dropdown-toggle" src={'../../public/assets/images/svg/ic_3_dots.svg'} alt="more-options" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false"/>
                                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton2">
                                                <li className="dropdown-item">
                                                    Delete
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="loc-card" style={{ marginTop: '20px' }}>
                                <div className="loc-h-card-content-con">
                                    <div className="loc-h-card-content">
                                        <img src={'../../public/assets/images/svg/ic_pdf.svg'} alt=""/>
                                        <div>
                                            <h4 style={{ marginBottom: '5px' }}>newfiles.pdf</h4>
                                            <h5>27-10-2024, 10:30 AM</h5>
                                        </div>
                                    </div>
                                    <div className="loc-h-tools">
                                        <div className="dropdown">
                                            <img className="dropdown-toggle" src={'../../public/assets/images/svg/ic_team_dropdown.svg'} alt="more-options" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"/>
                                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                <li className="dropdown-item">
                                                    <img src={'../../public/assets/images/svg/default_user.svg'} alt="user" />
                                                    <div>Jason Roy</div>
                                                </li>
                                                <li className="dropdown-item">
                                                    <img src={'../../public/assets/images/svg/default_user.svg'} alt="user" />
                                                    <div>Jos Butler</div>
                                                </li>
                                                <li className="dropdown-item">
                                                    <img src={'../../public/assets/images/svg/default_user.svg'} alt="user" />
                                                    <div>Ian Bell</div>
                                                </li>
                                            </ul>
                                        </div>
                                        <img style={{ cursor: 'pointer' }} src={'../../public/assets/images/svg/ic_share.svg'} alt="more-options" data-bs-toggle="modal" data-bs-target="#shareModal" />
                                        <div className="dropdown">
                                            <img className="dropdown-toggle" src={'../../public/assets/images/svg/ic_3_dots.svg'} alt="more-options" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false"/>
                                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton2">
                                                <li className="dropdown-item">
                                                    Delete
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="loc-h-content-details">
                <div className="loc-h-content-title">
                    Provenance Report
                </div>
                <div className="loc-card" style={{ marginTop: '20px' }}>
                    <div className="loc-card-content">
                        <div className="loc-h-card-content">
                            <img src={'../../public/assets/images/svg/ic_pdf.svg'} alt="" />
                            <div>
                                <h4 style={{ marginBottom: '5px' }}>myfiles.pdf</h4>
                                <h5 style={{ marginBottom: '5px' }}>10.10mb</h5>
                                <h5>25-10-2024, 10:30 AM</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="loc-h-activity-content-con">
                    <h4 style={{ fontSize: '14px', marginLeft: '20px' }}>Activities</h4>
                    <div className="loc-card" style={{ height: '100%' }}>
                        <div className="loc-h-activity-content">
                            <div style={{ fontSize: '14px' }}>Accessed On</div>
                            <div style={{ fontSize: '14px' }}>25-02-2024 10:20 AM</div>
                        </div>
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
                                <input ref={fileInputRef} type="file" name="file" className="drop-zone__input" style={{ display: 'none' }} onChange={handleChange}/>
                            </div>
                            <button className="loc-btn" type="button" style={{ marginTop: '30px', width: '200px' }} onClick={uploadFile}>
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <button data-bs-toggle="modal" data-bs-target="#exampleModal" className="loc-transparent-img-btn" style={{ position: 'fixed', bottom: '40px', right: '420px', zIndex: 50 }}>
                <img src={'../../public/assets/images/svg/ic_upload_file.svg'} alt="" />
            </button>
        </div>
    );
};

export default Home;